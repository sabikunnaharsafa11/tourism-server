const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.a87wj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    // console.log('database connected succesfully');
    const database = client.db("toursimTravel");
    const servicesCollection = database.collection("services");
    const orderCollection = database.collection("orders");

    // GET API
    app.get("/services", async (req, res) => {
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });

    // POST API
    app.post("/services", async (req, res) => {
      const newUser = req.body;
      console.log("got new user ", req.body);
      const result = await servicesCollection.insertOne(newUser);
      console.log("added user", result);
      res.send(result);
    });

    // GET single services
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      console.log("getting specific service", id);
      const query = { _id: ObjectId(id) };
      const service = await servicesCollection.findOne(query);
      res.json(service);
    });

    // orders
    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      console.log("order", order);
      res.json(result);
    });
    app.get('/orders',async (req,res)=>{
        const order = await orderCollection.find({});
        const result = await order.toArray();
        res.send(result)
    })
    // delect api
    app.delete("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await servicesCollection.deleteOne(query);
      res.json(result);
    });

    app.get("/orders/:email", async (req, res) => {
      const myOrder = await orderCollection
        .find({
          email: req.params.email,
        })
        .toArray();
      res.send(myOrder);
    });

    app.delete("/deleteOrders/:id", async (req, res) => {
      const id = req.params.id;
      const result = await orderCollection.deleteOne({
        _id: ObjectId(id),
      });
      console.log("deleted.fired");
      res.send(result);
    });
  } finally {
    //  await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("tourism travel server is running");
});

app.listen(port, () => {
  console.log("server running at port", port);
});
