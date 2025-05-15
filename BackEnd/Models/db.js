import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import { connect } from "mongoose";
const mongo_url = process.env.MONGO_CONN;

connect(mongo_url)
  .then(() => {
    console.log("MongoDB Connected...");
  })
  .catch((err) => {
    console.log("MongoDB Connection Error: ", err);
  });
