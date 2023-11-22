import mongoose from "mongoose";

const workScheduleSchema = new mongoose.Schema({
    day_of_week: {
        type: Number,
    },
    start_time: {
        type: String,
    },
    break_start_time: {
        type: String,
    },
    break_end_time: {
        type: String,
    },
    end_time: {
        type: String,
    },
    is_working: {
        type: Number,
        default: 1,
    },
});

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name can not be empty"],
    },
    email: {
        type: String,
        required: [true, "Email can not be empty"],
    },
    workSchedule: {
        type: [workScheduleSchema],
        default: [],
    },
});

export const User = mongoose.model("User", UserSchema);
