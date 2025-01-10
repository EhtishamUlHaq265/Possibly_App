import axios from "axios";
import { API_BASE_URL_AUTH } from "../config";


  export const getOccupationCount = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL_AUTH}getOccupationNameCount`);
      return response;
    } catch (error) {
      throw error; 
    }
  };

  export const getSubCatCount = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL_AUTH}subCatCount`);
      return response;
    } catch (error) {
      throw error; 
    }
  };