import axios from 'axios';
import {API_BASE_URL_AUTH} from '../config';

export const addFav = async (id, token) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL_AUTH}addFavCompany?companyId=${id}`,
      {},
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

export const removeFav = async (id, token) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL_AUTH}removeFavCompany?companyId=${id}`,
      {},
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

export const getFav = async token => {
  console.log(token);
  try {
    const response = await axios.get(`${API_BASE_URL_AUTH}getFavCompanies`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};
