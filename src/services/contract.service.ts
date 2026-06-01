import api from './api';

export const createContract = async (data: {
  room_id: number;
  tenant_id: number;
  start_date: string;
  end_date?: string | null;
}) => {
  const res = await api.post('/contracts', data);
  return res.data;
};

export const endContract = async (contractId: number) => {
  const res = await api.patch(`/contracts/${contractId}/end`);
  return res.data;
};

export const getContracts = async (params: any) => {
  const res = await api.get("/contracts", { params });
  return res.data;
};

export const getContractById = async (id: number) => {
  const res = await api.get(`/contracts/${id}`);
  return res.data;
};

export const getMyContracts = async (
  params?: any
) => {
  const res = await api.get(
    "/contracts/my",
    {
      params,
    }
  );

  return res.data;
};

export const updateContract = async (
  id: number,
  payload: any
) => {
  const res = await api.patch(
    `/contracts/${id}`,
    payload
  );

  return res.data;
};

