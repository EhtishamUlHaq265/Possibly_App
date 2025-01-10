import axios from 'axios';
import {API_BASE_URL_AUTH} from '../../config';

export const searchCompanyDetails = async (searchQuery, token) => {
  try {
    const queryString = searchQuery
      ? `searchQuery=${encodeURIComponent(searchQuery)}`
      : '';
    const response = await axios.get(
      `${API_BASE_URL_AUTH}getCompanyDetails?${queryString}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
