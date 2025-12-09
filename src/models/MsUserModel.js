import { supabase } from '../config/supabase.js';

export const msUserModel = {
    async postUserCredentials( email ) {
        const { data, error } = await supabase
            .from('MsUser')
            .select('Username, Email, Password, PhoneNumber')
            .eq('Email', email)

        if (error) throw error;
        return data;
    },

    async putUpdateUserData( username, phoneNumber, email ){
        const { data, error } = await supabase
            .from('MsUser')
            .update({ Username: username, PhoneNumber: phoneNumber })
            .eq('Email', email)
            .select()

        if (error) throw error;
        return data;
    },

    async getOldPassword(email){
        const { data, error } = await supabase
            .from('MsUser')
            .select('Password')
            .eq('Email', email)

        if (error) throw error;
        return data;
    },

    async putChangePassword( email, hashedPassword ){
        const { data, error } = await supabase
        .from ('MsUser')
        .update({ Password: hashedPassword })
        .eq('Email', email)
        .select()

        if (error) throw error
        return data
    }
}