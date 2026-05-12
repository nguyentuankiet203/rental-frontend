import api from "./api";

// landlord
export const getInvoices = async (params: any) => {
  const res = await api.get("/invoices", { params });
  return res.data;
};

// tenant
export const getMyInvoices = async (params?: any) => {
  const res = await api.get("/invoices/my", { params });
  return res.data;
};

// pay
export const payInvoice = async (invoiceId: number) => {
  if (!invoiceId || isNaN(invoiceId)) {
    throw new Error("Invalid invoiceId");
  }

  const res = await api.post(`/invoices/${invoiceId}/pay`);
  return res.data;
};

/* ================== ANALYTICS ================== */
export const getInvoiceSummary = async (propertyIds: number[]) => {
  const res = await api.get("/invoices/analytics/summary", {
    params: {
      propertyIds: propertyIds.join(","),
    },
  });
  return res.data;
};

export const getRevenueAnalytics = async (params: any) => {
  const res = await api.get("/invoices/analytics/revenue", {
    params,
  });
  return res.data;
};

