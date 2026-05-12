import api from "./api";

export const getUsers = async (params: any) => {
  const res = await api.get("/users", { params });
  return res.data;
};

export const createUser = async (data: any) => {
  const res = await api.post("/users", data);
  return res.data;
};

export const deleteUser = async (id: number) => {
  const res = await api.delete(`/users/${id}`);
  return res.data;
};

export const updateUser = async (
  id: string,
  data: any
) => {
  const res = await api.patch(
    `/users/${id}`,
    data
  );

  return res.data;
};
