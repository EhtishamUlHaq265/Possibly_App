import axios from "axios";
import { API_BASE_URL_AUTH } from "../config";

export const updateProfile = async (body, token) => {
  try {
    const response = await axios.post(`${API_BASE_URL_AUTH}updateUserProfile`, body, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response;
  } catch (error) {
    throw error; 
  }
};

export const getProfile = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL_AUTH}getUserProfile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response;
  } catch (error) {
    throw error; 
  }
};
