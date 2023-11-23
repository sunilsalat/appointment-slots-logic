import moment from "moment";

export const generateSlots = ({
    start_time,
    end_time,
    break_start_time,
    break_end_time,
}: any) => {
    let availableSlots = [];

    if (start_time) {
        let initialStartTime = moment(start_time, "HH:mm:ss");
        let breakStartTime = moment(break_start_time, "HH:mm:ss");
        let breakEndTime = moment(break_end_time, "HH:mm:ss");
        let endTime = moment(end_time, "HH:mm:ss");
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

        return availableSlots;
    }
};
