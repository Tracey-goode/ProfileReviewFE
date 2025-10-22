import axios from "axios";

const API_URL = "http://localhost:3000";

const apiService = {
    async getUsers() {
        return await axios.get(`${API_URL}/users`);
    },

    async getUserById(id) {
        return await axios.get(`${API_URL}/users/${id}`);
    },

    async getReviewsByUser(id) {
        return await axios.get(`${API_URL}/reviews?userId=${id}`);
    },

    async getReviewsPostedByUser(id) {
        return await axios.get(`${API_URL}/reviews?reviewedById=${id}`);
    },


    async loginUser(email, password) {
        const res = await axios.get(`${API_URL}/users?email=${email}&password=${password}`);
        return res;
    }
};


export default backEnd;