    import { supabase } from '../config/supabase.js';

    export const trEventModel = {
        async getAll() {
            const { data, error } = await supabase
                .from('TrEvent')
                .select('*');

            if (error) throw error;
            return data;
        }
    };