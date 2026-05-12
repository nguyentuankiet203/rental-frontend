import api from './api';

export const getRooms = async (propertyId: number) => {
  const res = await api.get("/rooms", {
    params: { propertyId },
  });
  return res.data;
};

export const createRoom = async (data: FormData) => {
  try {
    const res = await api.post("/rooms", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res;
  } catch (err: any) {
    console.error("ROOM CREATE ERROR:", err?.response?.data || err);
    throw err;
  }
};

export const updateRoom = async (id: number, data: any) => {
  return api.patch(`/rooms/${id}`, data);
};

export const deleteRoom = async (id: number) => {
  return api.delete(`/rooms/${id}`);
};

export const searchTenant = (search: string) => {
  return api
    .get("/users", {
      params: { role: "TENANT", search },
    })
    .then((res) => res.data);
};

export const createBulkRooms = (data: {
  property_id: number;
  quantity: number;
  price_per_month: number;
  start_number?: number;
}) => {
  return api.post("/rooms/bulk", data);
};

export const importRooms = async (data: {
  property_id: number;
  rooms: {
    room_number: number;
    price_per_month: number;
  }[];
}) => {
  return api.post("/rooms/import", data);
};