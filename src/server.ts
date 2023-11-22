import express from "express";
import mongoose from "mongoose";
import UserRouter from "./routes/UserRoutes";
import OrdreRouter from "./routes/OrderRoutes";

const app = express();

app.use(express.json());
app.use("/user", UserRouter);
app.use("/order", OrdreRouter);

const start = async () => {
    await mongoose.connect("mongodb://localhost:27017");
    app.listen(8000, () => {
        console.log(`Server started on port ${8000}...`);
    });
};

start();
