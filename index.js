const express = require('express')
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000
app.use(express.json());
app.use(cors(
  {
      origin: [
          "http://localhost:5173",
      ],
      credentials: true,
  }

))


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ono972m.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const tasksCollection = client.db('jobTasks8').collection('tasks')
    const usersCollection = client.db('jobTasks8').collection('users')






    app.put("/alltask/:id", async (req, res) => {
      const id = req.params.id;
      const newStatus = req.body.status;

      try {
        const result = await tasksCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { status: newStatus } }
        );

        res.json(result);
      } catch (error) {
        console.error('Error updating task status:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });


    app.delete("/deleteTask/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await tasksCollection.deleteOne(query);
      res.send(result);
    });


    app.put("/updateJobTasks/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const option = { upsert: true };
      const updateJobTask = req.body;
      const update = {
        $set: {
          title: updateJobTask.title,
          deadline: updateJobTask.deadline,
          description: updateJobTask.description,
          priority: updateJobTask.priority,
          status: updateJobTask.status,
          startDate: updateJobTask.startDate,
        }
      }
      const result = await tasksCollection.updateOne(filter, update, option)
      res.send(result)
    })


    app.get("/updateJobTask/:id", async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: new ObjectId(id)
      };
      const result = await tasksCollection.findOne(query)
      res.send(result)
    })

    // app.get("/alltasks", async (req, res) => {
    //   const cursor = tasksCollection.find();
    //   const result = await cursor.toArray()
    //   res.send(result)
    // })

  

    app.get('/getAllTask', async (req, res) => {
      console.log(req.query.email);
      let query = {}
      if (req.query?.email) {
        query = { email: req.query?.email }
      }
      const result = await tasksCollection.find(query).toArray();
      res.send(result)
    })



    app.post('/users', async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result)
    })

  
    app.post('/createTask', async (req, res) => {
      const task = req.body;
      const result = await tasksCollection.insertOne(task);
      res.send(result)
    })



    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




























app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})