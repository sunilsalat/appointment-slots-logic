import mongoose, { Schema, model } from "mongoose";

const OrderSchema = new mongoose.Schema({
    providerId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    customerId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    date: String,
    time: String,
    timeStamp: { type: Date },
});

export const Order = model("Order", OrderSchema);
