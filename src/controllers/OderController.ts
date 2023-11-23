import { Request, Response, request } from "express";
import { User } from "../models/User";
import { Order } from "../models/Order";
import moment from "moment";
import { generateSlots } from "../helper/generateSlotsBtwnTime";

export const createOrder = async (req: Request, res: Response) => {
    const payload = req.body;
    // const timestamp = moment(payload.date, "YYYY-MM-DD");
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
    requestDate = moment(requestDate, "YYYY-MM-DD");
    const dayOfWeek = requestDate.day();

    const provider = await User.findOne({ _id: providerId }).select(
        "workSchedule"
    );

    // check orders for that day only
    let orders: any = await Order.find({
        providerId,
        timeStamp: {
            $gte: requestDate.startOf("day").toDate(),
            $lte: requestDate.endOf("day").toDate(),
        },
    })
        .select("timeStamp -_id")
        .lean();

    // find providers working schedule
    const todaysProviderWorkTime: any = provider?.workSchedule.find(
        (item) => item.day_of_week == dayOfWeek
    );

    const { start_time, end_time, break_start_time, break_end_time } =
        todaysProviderWorkTime;

    // generate slots based on providers standard availability
    const availableSlots: any = generateSlots({
        start_time,
        end_time,
        break_start_time,
        break_end_time,
    });

    let finalSlots: any = [];
    if (availableSlots.length > 0 && orders && orders.length > 0) {
        orders = orders.map((item: any) => String(moment(item.timeStamp)));
        for (let i = 0; i < availableSlots?.length; i++) {
            const { startTime } = availableSlots[i];
            if (orders.includes(String(startTime)) == 1) {
                continue;
            }
            finalSlots.push(availableSlots[i]);
        }
    }

    let slots: any;
    if (orders && orders.length > 0) {
        slots = finalSlots;
    } else {
        slots = availableSlots;
    }

    res.status(200).json({ slots });
};
