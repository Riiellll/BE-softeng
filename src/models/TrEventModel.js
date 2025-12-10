    import { supabase } from '../config/supabase.js';

    export const trEventModel = {
        async getAll() {
            const { data, error } = await supabase
                .from('TrEvent')
                .select('*');

            if (error) throw error;
            return data;
        },

        async getAdminTablePending() {
            const { data, error } = await supabase
                .from('TrEvent')
                .select('ID, Name, Location, TrEventDetail (CPName), Sessions, VolunteerNeed')
                .is('Approved', null)

            if (error) throw error;
            return data;
        },

        async getAdminTableReviewed(){
            const { data, error } = await supabase
                .from('TrEvent')
                .select('Name, Location, TrEventDetail (CPName), Sessions, Approved, TrEventSession(EventDate)')
                .not('Approved', 'is', null)
                .order('EventDate', { referencedTable: 'TrEventSession', ascending: true })
                .limit(1, { referencedTable: 'TrEventSession' });

            if (error) throw error;
            return data;
        },

        async getAdminTablePastEvents(){
            const { data, error } = await supabase
                .from('TrEvent')
                .select('Name, Location, TrEventDetail(CPName), Approved, TrEventSession(EventDate)')
                .not('Approved', 'is', null)
                .order('EventDate', { referencedTable: 'TrEventSession', ascending: true })
                .limit(1, { referencedTable: 'TrEventSession' });
            
            if (error) throw error;
            return data;
        },

        async getEventDetailFile(id){
            const { data, error } = await supabase
                .from('TrEventDetail')
                .select('ProposalURL, LoAURL, DoCURL, PoVURL, EmergencyProcedureURL, TermsOfParticipationURL, TrEvent(ImageURL, OrganizerImageURL)')
                .eq('EventID', id)

            if (error) throw error
            return data
        },

        async getEventDetailData(id){
            const { data, error } = await supabase
                .from('TrEventDetail')
                .select('CPEmail, CPName, CPPhoneNumber, EmergencyCPPhoneNumber, TrEvent(Name, ShortDescription, Organizer, VolunteerNeed, PublishAtApproved)')
                .eq('EventID', id)

            if (error) throw error
            return data
        },

        async getEventStartDateAndTime(id){
            const { data, error } = await supabase
                .from('TrEventSession')
                .select('EventDate, StartTime, EndTime')
                .eq('EventID', id)
                .order('EventDate', { ascending: true })
                .limit(1)

            if (error) throw error
            return data
        },

        async getEventEndDate(id){
            const { data, error } = await supabase
                .from('TrEventSession')
                .select('EventDate')
                .eq('EventID', id)
                .order('EventDate', { descending: true })
                .limit(1)

            if (error) throw error
            return data
        },

        async getTotalSession(id){
            const { data, error } = await supabase
                .from('TrEventSession')
                .select('*', { count: 'exact', head: true })
                .eq('EventID', id)

            if (error) throw error
            return data
        },

        async putUpdateApproval(id, approvalStatus){
            const { data, error } = await supabase
                .from('TrEvent')
                .update({ Approved: approvalStatus })
                .eq('ID', id)
                .select()

            if (error) throw error
            return data
        }
    };