import api from "./api";

export const getProperties = async () => {
  const res = await api.get("/properties");
  return res.data;
};

export const createProperty = async (data: FormData) => {
  const res = await api.post("/properties", data);
  return res.data;
};

export const editProperty = async (
  id: number,
  data: FormData
) => {
  const res = await api.patch(
    `/properties/${id}`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
};