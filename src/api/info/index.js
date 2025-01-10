import axios from "axios";
import { API_BASE_URL_ADMIN, API_BASE_URL_AUTH } from "../config";


export const getInfoHub = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL_ADMIN}getInfoHub`);
      return response;
    } catch (error) {
      throw error; 
    }
  }; 
  export const getInfo = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL_AUTH}getInfo`);
      return response;
    } catch (error) {
      throw error; 
    }
  };