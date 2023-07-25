import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const mongodbURI = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.zttuzw8.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(mongodbURI, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));


await client.connect();
console.log("Connected to MongoDB");
const database = client.db('ecomerce');
const productsCollection = database.collection('products');



app.get("/", (req, res) => {
  res.send("hello world!");
});

app.get("/products", async (req, res) => {
  const data = await productsCollection.find({}).toArray();
  res.send({
    message: "all products",
    data: data
  });
});

app.get("/product/:id", async (req, res) => {
  try {
    const data = await productsCollection.findOne({ _id: req.params.id });
    if (!data) {
      return res.status(404).send({
        message: "Product not found"
      });
    }
    res.status(200).send({
      message: "Product Found",
      data
    });
  } catch (err) {
    res.status(500).send({
      message: "Error fetching product"
    });
  }
});

app.post("/product", async (req, res) => {
  try {
    const { name, price, quantity, description } = req.body;
    if (!name || !price || !description || !quantity) {
      return res.status(400).send("Required parameter missing.");
    }

    await productsCollection.insertOne({
      name,
      price,
      description,
      quantity
    });

    res.status(201).send({ message: "Product created" });
  } catch (err) {
    res.status(500).send({
      message: "Error creating product"
    });
  }
});

app.put("/product/:id", async (req, res) => {
  try {
    const { name, price, description, quantity } = req.body;
    if (!name && !price && !description && !quantity) {
      return res.status(400).send("At least one parameter is required: name, price, or description");
    }

    const data = await productsCollection.findOne({ _id: req.params.id });
    if (!data) {
      return res.status(404).send({
        message: "Product not found"
      });
    }

    const updatedProduct = {
      ...data,
      name: name || data.name,
      price: price || data.price,
      description: description || data.description,
      quantity: quantity || data.quantity,
    };

    await productsCollection.updateOne({ _id: req.params.id }, { $set: updatedProduct });

    res.status(200).send({
      message: "Product updated",
      data: updatedProduct
    });
  } catch (err) {
    res.status(500).send({
      message: "Error updating product"
    });
  }
});

app.delete("/product/:id", async (req, res) => {
  try {
    console.log(req.params.id);
    const data = await productsCollection.findOne({ _id: req.params.id });
    if (!data) {
      return res.status(404).send({
        message: "Product not found"
      });
    }

    await productsCollection.deleteOne({ _id: req.params.id });
    res.status(200).send({
      message: "Product deleted"
    });
  } catch (err) {
    res.status(500).send({
      message: "Error deleting product"
    });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
