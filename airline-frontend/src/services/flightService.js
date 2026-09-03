import axios from "axios";

const API_URL = "http://localhost:8080/api/flights";

export const searchFlights = async (from, to, date) => {
    const response = await axios.get(`${API_URL}/search`, {
        params: {
            from: from,
            to: to,
            date: date
        }
    });

    return response.data;
};