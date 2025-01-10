import axios from 'axios';
import {API_BASE_URL_AUTH} from '../config';

// Helper function to handle errors consistently
const handleApiError = error => {
  if (error.response && error.response.data && error.response.data.message) {
    throw new Error(error.response.data.message); // Backend error message
  } else {
    throw new Error('Ein Fehler ist aufgetreten. Bitte versuche es erneut.'); // Generic error message
  }
};

export const signUp = async body => {
  try {
    const response = await axios.post(`${API_BASE_URL_AUTH}signUp`, body);
    return response;
  } catch (error) {
    handleApiError(error); // Handle error consistently
  }
};

export const signIn = async body => {
  try {
    const response = await axios.post(`${API_BASE_URL_AUTH}signIn`, body);
    return response;
  } catch (error) {
    handleApiError(error);
  }
};

export const sendOtp = async email => {
  try {
    const response = await axios.post(
      `${API_BASE_URL_AUTH}sendOtp?email=${email}`,
    );
    return response;
  } catch (error) {
    handleApiError(error);
  }
};

export const resetPassword = async body => {
  try {
    const response = await axios.post(
      `${API_BASE_URL_AUTH}resetPassword`,
      body,
    );
    return response;
  } catch (error) {
    handleApiError(error);
  }
};

export const forgetPassword = async body => {
  try {
    const response = await axios.post(
      `${API_BASE_URL_AUTH}forgetPassword`,
      body,
    );
    return response;
  } catch (error) {
    handleApiError(error);
  }
};

export const verifyOtp = async (email, otp) => {
  try {
    const response = await axios.post(`${API_BASE_URL_AUTH}verifyOtp`, {
      email,
      otp,
    });
    return response;
  } catch (error) {
    handleApiError(error);
  }
};
