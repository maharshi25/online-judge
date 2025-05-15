import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import AuthRouter from "./Routes/AuthRouter.js";
import "./Models/db.js";

const app = express();
dotenv.config({ path: "./.env" });
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use(bodyParser.json());
app.use(cors());
app.use("/auth", AuthRouter);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
