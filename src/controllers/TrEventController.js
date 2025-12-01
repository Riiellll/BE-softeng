import { trEventModel } from '../models/TrEventModel.js';

export const trEventController = {
    async getEvents(req, res) {
        try {
            const users = await trEventModel.getAll();
            res.json({ success: true, data: users });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }
};