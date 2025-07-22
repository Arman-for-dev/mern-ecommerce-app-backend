import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import todoRoute from "./routes/todo.routes.js";
import userRoute from "./routes/user.route.js";

const app = express();
const port = process.env.PORT || 5000;

mongoose

.connect(process.env.MONGODB_URI)

.then(() => console.log("Connected to MongoDB..."))

.catch((err) => console.error("Could not connect to MongoDB..."));


//Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());


app.use("/service/todo", todoRoute)
app.use("/api/user", userRoute);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});