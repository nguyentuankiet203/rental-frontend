import api from './api';

export const createPayment = async (invoiceId: number) => {
  const res = await api.get(`/payments/${invoiceId}`);
  return res.data;
};

export const handlePaymentReturn = async (params: any) => {
  const res = await api.get('/payments/return', { params });
  return res.data;
}