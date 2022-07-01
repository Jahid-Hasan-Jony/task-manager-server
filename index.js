const express = require('express');
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4mj3m.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect()
        const taskManager = client.db('taskmanager').collection('tasks');

        //insert dataa 
        app.post('/task', async (req, res) => {
            const task = req.body;
            const result = await taskManager.insertOne(task);
            res.send(result);
        });

        // get all data To-Do
        app.get('/task', async (req, res) => {
            const query = { 'status': false };
            const cursor = taskManager.find(query)
            const allData = await cursor.toArray();
            res.send(allData);
        });

        // get all data Complete task
        app.get('/task-complete', async (req, res) => {
            const query = { 'status': true };
            const cursor = taskManager.find(query)
            const allData = await cursor.toArray();
            res.send(allData);
        });


        //update Task
        app.put('/task', async (req, res) => {
            const userTask = req.body;
            const id = userTask.id;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedoc = {
                $set: userTask,
            };
            const result = await taskManager.updateOne(filter, updatedoc, options);
            res.send({ result });
        });

    }
    finally { }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello jonyyy!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
