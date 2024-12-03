"use server";

import axios from "axios";

const url = process.env.URL || process.env.BACKUP_AWS;
const api = url + "/requests";

export const getAllRequests = async () => {
  try {
    const response = await axios.get(api);
    return response.data;
  } catch (e) {
    return e.response.data || { error: "operação fracassou" };
  }
};

export const getLocais = async () => {
  try {
    const response = await axios.get(`${api}/locais`);
    return response.data;
  } catch (e) {
    return e.response.data || { error: "operação fracassou" };
  }
};

export const getRequestByLocal = async (local) => {
  try {
    const response = await axios.get(`${api}/local/${local}`);
    return response.data;
  } catch (e) {
    return e.response.data || { error: "operação fracassou" };
  }
};

export const getRequestsByName = async (title) => {
  try {
    const response = await axios.get(`${api}/title/${title}`);
    return response.data;
  } catch (e) {
    return e.response.data || { error: "operação fracassou" };
  }
};

export const getRequestById = async (id) => {
  try {
    const response = await axios.get(`${api}/${id}`);
    console.log("RESPONSE" + response.data);
    return response.data;
  } catch (e) {
    return e.response.data || { error: "operação fracassou" };
  }
};

export const getRequestByStatus = async (status) => {
  try {
    const response = await axios.get(`${api}/status/${status}`);
    return response.data;
  } catch (e) {
    return e.response.data || { error: "operação fracassou" };
  }
};

export const getRequestByCreationDate = async (date) => {
  try {
    const response = await axios.get(`${api}/creation/${date}`);
    return response.data;
  } catch (e) {
    return e.response.data || { error: "operação fracassou" };
  }
};

export const getRequestByFinishDate = async (date) => {
  try {
    const response = await axios.get(`${api}/finish/${date}`);
    return response.data;
  } catch (e) {
    return e.response.data || { error: "operação fracassou" };
  }
};

export const getRequestByUser = async (user) => {
  try {
    const response = await axios.get(`${api}/user/${user}`);
    return response.data;
  } catch (e) {
    return e.response.data || { error: "operação fracassou" };
  }
};

export const getRequestsByPriority = async(priority) => {
  try {
    const response = await axios.get(`${api}/priority/${priority}`);
    return response.data;
  } catch(e) {
    return e.response.data || { error: "operação fracassou" };
  }
}

export const createRequest = async (requestData, token) => {
  try {
    const response = await axios.post(`${api}`, requestData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log("form!!!!!:", requestData);
    console.log(response.data);
    return response.data;
  } catch (e) {
    return { error: "Error creating request", message: e.message };
  }
};

export const updateRequest = async (id, request, token) => {  
  try {
    const response = await axios.put(`${api}/${id}`, request, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log(response.data);
    return response.data;
  } catch (e) {
    return e.response.data || { error: "operação fracassou" };
  }
};

export const deleteRequest = async (id) => {
  try {
    const response = await axios.delete(`${api}/${id}`);
    return response.data;
  } catch (e) {
    return e.response.data || { error: "operação fracassou" };
  }
};

export const updateStatus = async (id, status, email, token) => {
  try {
    const response = await axios.patch(
      `${api}/status/${id}`,
      { status: status, email: email },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (e) {
    return e.response.data || { error: "operação fracassou" };
  }
};