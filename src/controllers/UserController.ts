import { Request, Response } from "express";
import { User } from "../models/User";

export const createUser = async (req: Request, res: Response) => {
    const { name, email } = req.body;
    const userObj = await User.create({ name, email });
    res.status(200).json({ userObj });
};

export const updateUser = async (req: Request, res: Response) => {
    const { userId, data } = req.body;
    const userObj = await User.findOneAndUpdate(
        { _id: userId },
        { workSchedule: data }
    );
    res.status(200).json({ userObj });
};
