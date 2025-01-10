import axios from "axios";
import { API_BASE_URL_AUTH } from "../../config";


  export const getPostedJob = async (id, token) => {
    try {
      const response = await axios.get(`${API_BASE_URL_AUTH}getPostedJob?companyId=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response;
    } catch (error) {
      throw error; 
    }
  };
  
  export const getPostedJobId = async (id, token) => {
    try {
      const response = await axios.get(`${API_BASE_URL_AUTH}getPostedJobId?jobId=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response;
    } catch (error) {
      throw error; 
    }
  };