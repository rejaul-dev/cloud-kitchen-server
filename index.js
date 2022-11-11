const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.uugevwk.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const serviceCollection = client.db("cloudKitchen").collection("services");
// for home page
    app.get("/home-services", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query).limit(3);
      const service = await cursor.toArray();
      console.log(service)
      res.send(service);
    });

    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const service = await cursor.toArray();
      console.log(service)
      res.send(service);
    });

    app.get('/services/:id', async (req, res)=>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)}
      const service = await serviceCollection.findOne(query)
      res.send(service);
    })

    app.post("/services", async (req, res) => {
      const services = req.body;
      const result = await serviceCollection.insertOne(services);
      res.send(result);
    });



    
  } finally {
  }
}
run().catch((error) => console.log(error));

app.get("/", (req, res) => {
  res.send("cloud kitchen is running");
});

app.listen(port, () => {
  console.log(`cloud kitchen server is running on port: ${port}`);
});
