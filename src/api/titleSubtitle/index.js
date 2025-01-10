import axios from "axios";
import { API_BASE_URL_AUTH, API_BASE_URL_COMPANY } from "../config";
  
  export const titleSubtitle = async (body, token) => {
    try {
      const response = await axios.post(`${API_BASE_URL_COMPANY}titleSubtitle`,body,{
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response;
    } catch (error) {
      console.error( error);
      throw error; 
    }
  }; 

  export const getSubtitles = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL_COMPANY}getSubtitles`);
      return response;
    } catch (error) {
      console.error( error);
      throw error; 
    }
  }; 

  export const getcompaniesByTitle = async (token,title) => {
    try {
      const response = await axios.get(`${API_BASE_URL_AUTH}getCompayByTitle?title=${title}`,{
        headers: {
          Authorization: `Bearer ${token}` 
        }
      });
      return response;
    } catch (error) {
      throw error; 
    }
  }; 

  export const getcompaniesBySubtitle = async (token,subTitle) => {
    try {
      const response = await axios.get(`${API_BASE_URL_AUTH}getCompayByTitle?subTitle=${subTitle}`,{
        headers: {
          Authorization: `Bearer ${token}` 
        }
      });
      return response;
    } catch (error) {
      throw error; 
    }
  }; 