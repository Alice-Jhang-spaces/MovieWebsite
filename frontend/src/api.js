import axios from "axios";

const userApi = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    withCredentials: true,
});


export const loginUser = (email, password) => {
    return userApi.post("/login", { email, password });
};

// export const checkEmailExists = (email) => {
//     return userApi.post("/check-email", { email });
// };

export const saveEmail = async (email) => {
    return userApi.post("/save-email", { email });
};

export const verifyCode = async (email, code) => {
    return userApi.post("/verify-code", { email, code });
};

export const registerUser = async (tempToken, password) => {
    return userApi.post("/register", { tempToken, password });
};

export const requestPasswordReset = async (email) => {
    return userApi.post("/reset-password/request", { email });
};

export const resetPassword = async (tempToken, newPassword) => {
    return userApi.post("/reset-password", { tempToken, newPassword });
};

export const getTheaterShowtimes = (movieId, date) => {
    return axios.get(`${process.env.REACT_APP_API_URL}/bookings/showtimes/${movieId}`, {
        params: { date },
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
};

export const createBooking = (bookingData) => {
    return axios.post(`${process.env.REACT_APP_API_URL}/bookings`, bookingData, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
};

export const getBookingDetails = (bookingId) => {
    return axios.get(`${process.env.REACT_APP_API_URL}/bookings/${bookingId}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
};

export const getUserBookings = () => {
    return axios.get(`${process.env.REACT_APP_API_URL}/bookings/user/history`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
};