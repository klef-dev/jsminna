import express, { Application, Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";

import router from "./routes/api";

const app: Application = express();

const port: Number = 5000 || process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Start MongoDB
const db: string = "mongodb://localhost:27017/store";

(async function () {
  try {
    await mongoose.connect(db, { useNewUrlParser: true });
    return console.log(`Successfully connected to ${db}`);
  } catch (error) {
    console.log("Error connecting to database: ", error);
    return process.exit(1);
  }
})();

app.get("/", (request: Request, response: Response) => {
  response.json({ msg: "Welcome to the store" }).status(200);
});

app.use("/api", router);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
