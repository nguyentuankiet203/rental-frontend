import api from "./api";

export const getDashboard = async () => {
  const res = await api.get("/dashboard");
  return res.data;
};

export const getRevenueChart = async ({
  propertyIds = [],
  year,
}: {
  propertyIds?: number[];
  year?: number;
}) => {
  const res = await api.get("/dashboard/revenue", {
    params: {
      propertyIds: propertyIds.join(","),
      year,
    },
  });

  return res.data;
};

export const formatMoney = (value: number) => {
  return value.toLocaleString("vi-VN") + " đ";
};
