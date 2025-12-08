import { trNotificationModel } from '../models/TrNotificationModel.js';

export const trNotificationController = {
    async getNotifications(req, res) {
        try {
            const data = await trNotificationModel.getNotifications();
            let dataProcessed = data.map(ev => {
                let isoDate = new Date(ev.DateIn);
                let shortDesc = ev.Description.slice(0,120) + "..";

                return {
                    ...ev,
                    TailwindColor: ev.MsNotificationBadge.TailwindColor,
                    BadgeName: ev.MsNotificationBadge.BadgeName,
                    ShortDesc: shortDesc,

                    Day: isoDate.toLocaleDateString("en-US", { weekday: "short"}),
                    Date: isoDate.getDate().toString(),
                    Month: isoDate.toLocaleDateString("en-US", { month: "long" }),

                    MsNotificationBadge: undefined,
                    isoDate: undefined,
                    DateIn: undefined
                };
            });
            res.json({ dataTrNotification: dataProcessed })
        } catch (err) {
            res.json({ success: false, message: err.message});
        }
    },
    
    async getNotificationDetail(req, res) {
        try {
            const { id } = req.params;
            const data = await trNotificationModel.getNotificationDetail( id );
            let dataProcessed = data.map(ev => {
                let isoDate = new Date(ev.DateIn);

                return {
                    ...ev,

                    Date: isoDate.getDate().toString(),
                    Month: isoDate.toLocaleDateString("en-US", { month: "long" }),
                    Year: isoDate.getFullYear().toString(),

                    DateIn: undefined
                };
            });
            res.json({ dataTrNotification: dataProcessed })
        } catch (err) {
            res.json({ success: false, message: err.message});
        }
    },

    async postNotification(req, res) {
        try{
            const { title, description, badgeID } = req.body;

            const dateIn = new Date();
            dateIn.setHours(dateIn.getHours() + 7);
            const dateInNoTimestamp = dateIn.toISOString().slice(0, 19);

            let totalID = await trNotificationModel.getTotalID();
            totalID = totalID + 1;

            await trNotificationModel.postNotification(totalID, title, description, badgeID, dateInNoTimestamp);

            res.json({ success: true, message: "Success inserting notification"});
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }
};