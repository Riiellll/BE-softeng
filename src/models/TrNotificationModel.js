import { supabase } from '../config/supabase.js';

export const trNotificationModel = {

    async getNotifications() {
        const { data, error } = await supabase
            .from('TrNotification')
            .select('ID, MsNotificationBadge (BadgeName, TailwindColor), Title, Description, DateIn');

        if (error) throw error;
        return data;
    },

    async getNotificationDetail( id ) {
        const { data, error } = await supabase
            .from('TrNotification')
            .select('Title, DateIn, Description')
            .eq('ID', id )

        if (error) throw error;
        return data;
    },

    async getTotalID() {
        const { _, count, error } = await supabase
            .from('TrNotification')
            .select('*', { count: 'exact', head: true });
    
        if (error) throw error;
        return count;
    },

    async postNotification( ID, title, description, badgeID, dateIn){
        const { error } = await supabase
            .from('TrNotification')
            .insert({ ID: ID, Title: title, Description: description, BadgeID: badgeID, DateIn: dateIn});

        if (error) throw error;
    }
};