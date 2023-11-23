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

    // find providers working schedule
    const todaysProviderWorkTime: any = provider?.workSchedule.find(
        (item) => item.day_of_week == dayOfWeek
    );

    // generate slots based on providers standard availability
    if (todaysProviderWorkTime) {
        let initialStartTime = moment(
            todaysProviderWorkTime.start_time,
            "HH:mm:ss"
        );

        let breakStartTime = moment(
            todaysProviderWorkTime.break_start_time,
            "HH:mm:ss"
        );

        let breakEndTime = moment(
            todaysProviderWorkTime.break_end_time,
            "HH:mm:ss"
        );

        let endTime = moment(todaysProviderWorkTime.end_time, "HH:mm:ss");
        let ST: any = initialStartTime;
        let ET: any;
        while (ST.isBefore(endTime)) {
            ET = moment(ST, "HH:mm:ss").add(1, "hours");
            if (
                (ST.isBefore(breakStartTime) && ET.isBefore(breakStartTime)) ||
                ST.isAfter(breakEndTime)
            ) {
                const obj = {
                    startTime: ST,
                    endTime: ET,
                };
                availableSlots.push(obj);
            }
            ST = moment(ST, "HH:mm:ss").add(1, "hours");
        }
    }

    res.status(200).json({ availableSlots });
};
