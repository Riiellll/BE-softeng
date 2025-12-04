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
                .select('Name, Location, TrEventDetail (CPName), Sessions, VolunteerNeed')
                .is('Approved', null);

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
        }
    };