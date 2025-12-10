import { trEventModel } from '../models/TrEventModel.js';
import JSZip from "jszip";
import fetch from "node-fetch";

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
    },

    async getEventDetail(req, res){
        try {
            const { id } = req.params
            const eventDetailFiles = await trEventModel.getEventDetailFile(id)
            // let eventDetailFilesFlattened = eventDetailFiles.map( ev => ({
            //     ...ev,
            //     ImageURL: ev.TrEvent.ImageURL,
            //     OrganizerImageURL: ev.TrEvent.OrganizerImageURL,
            //     TrEvent: undefined
            // }))

            let fileNames = eventDetailFiles.map(ev => ({
                Proposal: ev.ProposalURL.split("/")[9].replace(/%20/g, " "),
                LoA: ev.LoAURL.split("/")[9].replace(/%20/g, " "),
                DoC: ev.DoCURL.split("/")[9].replace(/%20/g, " "),
                PoV: ev.PoVURL.split("/")[9].replace(/%20/g, " "),
                EmergencyProcedure: ev.EmergencyProcedureURL.split("/")[9].replace(/%20/g, " "),
                TermsOfParticipation: ev.TermsOfParticipationURL.split("/")[9].replace(/%20/g, " "),
                ImageURL: ev.TrEvent.ImageURL.split("/")[9].replace(/%20/g, " "),
                OrganizerImageURL: ev.TrEvent.OrganizerImageURL.split("/")[9].replace(/%20/g, " ")
            }))

            let eventStartDate = await trEventModel.getEventStartDateAndTime(id)
            let eventEndDate = await trEventModel.getEventEndDate(id)
            const totalSession = await trEventModel.getTotalSession(id)
            let startDate = new Date(eventStartDate[0].EventDate)
            let endDate = new Date(eventEndDate[0].EventDate)
            let endDateValidation = eventEndDate[0].EventDate
            const diffDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
            let daysInterval = diffDays / totalSession;

            if (!daysInterval){
                daysInterval = "-"
                endDateValidation = "-"
            }

            const eventData = await trEventModel.getEventDetailData(id)
            let eventDataFlattened = eventData.map(ev => ({
                ...ev,
                EventName: ev.TrEvent.Name,
                Organizer: ev.TrEvent.Organizer,
                VolunteerNeed: ev.TrEvent.VolunteerNeed,
                Description: ev.TrEvent.ShortDescription,
                PublishAtApproved: ev.TrEvent.PublishAtApproved,
                StartDate: eventStartDate[0].EventDate,
                EndDate: endDateValidation,
                StartTime: eventStartDate[0].StartTime,
                EndTime: eventStartDate[0].EndTime,
                daysInterval: daysInterval,
                TrEvent: undefined
            }))
            

            // res.json({ success: true, fileURL: eventDetailFilesFlattened, FileNames: fileNames, EventData: eventDataFlattened})
            res.json({ success: true, FileNames: fileNames, EventData: eventDataFlattened})
        } catch (err) {
            res.status(500).json({ success: false, message: err.message })
        }
    },

    async putUpdateApproval(req, res){
        try {
            const { id, approvalStatus } = req.params
            let status = false
            if (approvalStatus == "true"){
                status = true
            }
            const response = await trEventModel.putUpdateApproval(id, status)
            res.json({ success: true })
        } catch (err) {
            res.status(500).json({ success: false, message: err.message })
        }
    },

    async getDownloadFilesZipped(req, res){
        try {
            const { id } = req.params;
            const eventDetailFiles = await trEventModel.getEventDetailFile(id);
            const urls = [];

            eventDetailFiles.forEach(ev => {
                if (ev.ProposalURL) urls.push(ev.ProposalURL);
                if (ev.LoAURL) urls.push(ev.LoAURL);
                if (ev.DoCURL) urls.push(ev.DoCURL);
                if (ev.PoVURL) urls.push(ev.PoVURL);
                if (ev.EmergencyProcedureURL) urls.push(ev.EmergencyProcedureURL);
                if (ev.TermsOfParticipationURL) urls.push(ev.TermsOfParticipationURL);
                if (ev.TrEvent?.ImageURL) urls.push(ev.TrEvent.ImageURL);
                if (ev.TrEvent?.OrganizerImageURL) urls.push(ev.TrEvent.OrganizerImageURL);
            });

            const zip = new JSZip();
            for (const url of urls) {
                try {
                    const response = await fetch(url);
                    const buffer = await response.arrayBuffer();
                    const fileName = decodeURIComponent(url.split("/").pop().split("?")[0]);
                    zip.file(fileName, buffer);
                } catch (err) {
                    console.log(`Failed to download ${url}:`, err.message);
                }
            }

            const zipFile = await zip.generateAsync({ type: "nodebuffer" });
            res.set({
                "Content-Type": "application/zip",
                "Content-Disposition": "attachment; filename=event_files.zip"
            });
            res.send(zipFile);
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }
};