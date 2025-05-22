import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001/api";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export interface User {
  id: number;
  username: string;
  role: string;
}

export interface Software {
  id?: number;
  name: string;
  description: string;
  accessLevels: ("Read" | "Write" | "Admin")[];
}

export const fetchSoftwares = async (): Promise<Software[]> => {
  const res = await axios.get(`${API_BASE}/software`, { headers: getAuthHeader() });
  return res.data;
};
export const fetchEmployees = async (): Promise<User[]> => {
  const res = await axios.get(`${API_BASE}/users/employees`, { headers: getAuthHeader() });
  return res.data;
};

export const fetchManagers = async (): Promise<User[]> => {
  const res = await axios.get(`${API_BASE}/users/managers`, { headers: getAuthHeader() });
  return res.data;
};
export const createSoftware = async (software: Software) => {
  const res = await axios.post(`${API_BASE}/software`, software, { headers: getAuthHeader() });
  return res.data;
};

export const updateSoftware = async (id: number, software: Software) => {
  const res = await axios.put(`${API_BASE}/software/${id}`, software, { headers: getAuthHeader() });
  return res.data;
};

export const deleteSoftware = async (id: number) => {
  const res = await axios.delete(`${API_BASE}/software/${id}`, { headers: getAuthHeader() });
  return res.data;
};


export const signupUser = async (formData: { username: string; password: string; role: string }) => {
  const res = await axios.post(`${API_BASE}/auth/signup`, formData);
  return res.data;
};

export const loginUser = async (formData: { username: string; password: string; role: string }) => {
  const res = await axios.post(`${API_BASE}/auth/login`, formData);
  return res.data;
};