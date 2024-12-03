'use server';

import axios from "axios";

const url = process.env.URL || process.env.BACKUP_AWS;
const api = url + '/data';

export const getAllReqsWithLocals = async() => {
    try {
        const response = await axios.get(api);
        return response.data;
    } catch(e) {
        return e.response.data;
    }   
}

export const getAllDataRequests = async() => {
    try {
        const response = await axios.get(api + '/requests_data');
        return response.data;
    } catch(e) {
        return e.response.data;
    }
}