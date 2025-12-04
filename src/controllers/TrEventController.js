import { trEventModel } from '../models/TrEventModel.js';

export const trEventController = {
    async getEvents(req, res) {
        try {
            const users = await trEventModel.getAll();
            res.json({ success: true, data: users });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },
    
    async getAdminTablePending(req, res) {
        try {
            const data = await trEventModel.getAdminTablePending();
            let dataProcessed = data.map(ev => ({
                ...ev,
                CPName: ev.TrEventDetail[0].CPName,
                TrEventDetail: undefined   // remove TrEventDetail
            }));
            res.json({ dataTrEvent: dataProcessed})
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },

    async getAdminTableReviewed(req, res) {
        try {
            const data = await trEventModel.getAdminTableReviewed();
            let dataProcessed = data.map(ev => ({
                ...ev,
                CPName: ev.TrEventDetail[0].CPName,
                Status: ev.Approved? "Approved" : "Rejected",
                EventDate: ev.TrEventSession[0].EventDate,
                TrEventDetail: undefined,   // remove TrEventDetail
                TrEventSession: undefined   // remove TrEventSession
            }));
            const today = new Date();
            const reviewedEventsData = dataProcessed.filter(event => {
                return new Date(event.EventDate) > today;
            });
            res.json({ dataTrEvent: reviewedEventsData})
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },

    async getAdminTablePastEvents(req, res) {
        try {
            const data = await trEventModel.getAdminTablePastEvents();
            let dataProcessed = data.map(ev => ({
                ...ev,
                CPName: ev.TrEventDetail[0].CPName,
                Status: ev.Approved? "Approved" : "Rejected",
                EventDate: ev.TrEventSession[0].EventDate,
                TrEventDetail: undefined,   // remove TrEventDetail
                TrEventSession: undefined   // remove TrEventSession
            }));

            const today = new Date();
            const pastEventsData = dataProcessed.filter(event => {
                return new Date(event.EventDate) < today;
            });
            res.json({ dataTrEvent: pastEventsData})
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }
};