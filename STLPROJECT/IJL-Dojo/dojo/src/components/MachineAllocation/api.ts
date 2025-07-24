// src/api/api.ts
import axios from 'axios';
import { 
  MachineAllocation,
  Machine
} from './types';

const API_BASE_URL = 'http://127.0.0.1:8000';

export const fetchMachines = async () => {
  const response = await axios.get(`${API_BASE_URL}/machines/`);
  return response.data;
};

export const createMachine = async (data: FormData) => {
  const response = await axios.post(`${API_BASE_URL}/machines/`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateMachine = async (id: number, data: FormData) => {
  const response = await axios.put(`${API_BASE_URL}/machines/${id}/`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteMachine = async (id: number) => {
  await axios.delete(`${API_BASE_URL}/machines/${id}/`);
};

export const fetchMachineAllocations = async () => {
  const response = await axios.get(`${API_BASE_URL}/machine-allocations/`);
  return response.data;
};

export const createMachineAllocation = async (data: Partial<MachineAllocation>) => {
  const response = await axios.post(`${API_BASE_URL}/machine-allocations/`, data);
  return response.data;
};

export const updateMachineAllocation = async (id: number, data: Partial<MachineAllocation>) => {
  const response = await axios.put(`${API_BASE_URL}/machine-allocations/${id}/`, data);
  return response.data;
};

export const deleteMachineAllocation = async (id: number) => {
  await axios.delete(`${API_BASE_URL}/machine-allocations/${id}/`);
};