import axios from "axios";
import { API_BASE_URL_AUTH } from "../config";

export const changePassword = async (body, token) => {
  try {
    const response = await axios.post(`${API_BASE_URL_AUTH}changePassword`, body, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response;
  } catch (error) {
    console.error(error);
    throw error; 
  }
};
