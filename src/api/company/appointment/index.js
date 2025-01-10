import axios from "axios";
import { API_BASE_URL_AUTH } from "../../config";

export const requestAppointment = async (body, token) => {
  try {
    const response = await axios.post(`${API_BASE_URL_AUTH}requestAppointment`, body, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response;
  } catch (error) {
    throw error; 
  }
};
