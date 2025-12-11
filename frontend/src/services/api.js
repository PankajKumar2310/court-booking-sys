import axios from 'axios';


const getBaseURL = () => {
   
    if (import.meta.env.PROD) {
 
        return 'https://court-booking-sys-backend.onrender.com/api';
    }
   
    return 'http://localhost:5000/api';
};

const api = axios.create({
    baseURL: getBaseURL(),
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
