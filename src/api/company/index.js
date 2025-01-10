import axios from 'axios';
import {API_BASE_URL_AUTH} from '../config';
export const getCompanyDetails = async () => {
  const response = await axios.get(`${API_BASE_URL_AUTH}getCompanyDetails`);
  return response;
};

export const getCompanyDetailsId = async (id, token) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL_AUTH}getCompanyDetailsId?_id=${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response;
  } catch (error) {
    throw error;
  }
};
