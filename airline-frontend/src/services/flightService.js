import axios from "axios";

const API_URL = "http://localhost:8080/api/flights";

export const searchFlights = async (from, to, date) => {
    try {
        console.log("Searching flights with:", {
            from,
            to,
            date
        });

        const response = await axios.get(`${API_URL}/search`, {
            params: {
                from,
                to,
                date
            }
        });

        console.log("Backend response:", response.data);

        return response.data;

    } catch (error) {
        console.error("Flight Search Error:", error);
        console.error("Status:", error.response?.status);
        console.error("Response:", error.response?.data);

        throw error;
    }
};