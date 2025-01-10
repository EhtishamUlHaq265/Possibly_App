import axios from 'axios';
import {API_BASE_URL_AUTH} from '../../config';

export const getAppliedAppointments = async token => {
  try {
    const response = await axios.get(
      `${API_BASE_URL_AUTH}getAppointments?archived=false`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data.data ?? [];
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getArchivedAppointments = async token => {
  try {
    const response = await axios.get(
      `${API_BASE_URL_AUTH}getAppointments?archived=true`,
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

export const archive = async (token, appointmentId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL_AUTH}archiveAppointments?_id=${appointmentId}&archived=true`,
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

export const unArchive = async (token, appointmentId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL_AUTH}archiveAppointments?_id=${appointmentId}&archived=false`,
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

export const getApprovedAppointments = async token => {
  try {
    const response = await axios.get(
      `${API_BASE_URL_AUTH}getAppointments?archived=false`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const allAppointments = response.data.data ?? [];

    const approved =
      allAppointments.filter(appointment => appointment.isApproved === true) ??
      [];
    return approved;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getRejectedAppointments = async token => {
  try {
    const response = await axios.get(
      `${API_BASE_URL_AUTH}getAppointments?archived=false`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const allAppointments = response.data.data ?? [];
    const rejected =
      allAppointments.filter(appointment => appointment.isReject === true) ??
      [];
    return rejected;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
