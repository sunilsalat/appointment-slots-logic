import { Request, Response, request } from "express";
import { User } from "../models/User";
import { Order } from "../models/Order";
import moment from "moment";

export const createOrder = async (req: Request, res: Response) => {
    const payload = req.body;
    const orderObj = await Order.create(payload);
    res.status(200).json({ orderObj });
};

export const updateOrder = async (req: Request, res: Response) => {
    const { orderId, data } = req.body;
    const orderObj = await Order.findOneAndUpdate(
        { _id: orderId },
        { workSchedule: data }
    );
    res.status(200).json({ orderObj });
};

export const checkAvailability = async (req: Request, res: Response) => {
    let { providerId, requestDate } = req.body;
    const availableSlots = [];
    requestDate = moment(requestDate, "YYYY-MM-DD");
    const dayOfWeek = requestDate.day();

    const provider = await User.findOne({ _id: providerId }).select(
        "workSchedule"
    );

    // check orders for that day only
    const orders = await Order.findOne({
        providerId,
        timeStamp: {
            $gte: requestDate.startOf("day").toDate(),
            $lte: requestDate.endOf("day").toDate(),
        },
    });

    const todaysProviderWorkTime: any = provider?.workSchedule.find(
        (item) => item.day_of_week == dayOfWeek
    );

    console.log(todaysProviderWorkTime);

    res.status(200).json({});
};
