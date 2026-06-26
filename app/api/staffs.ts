import apiClient from "./axios";

export type StaffStatus = "active" | "inactive";

export type Staff = {
  id: number;
  username: string;
  email: string;
  status: StaffStatus;
  role: "stylist";
  created_at: string;
};

export type StaffPayload = {
  username?: string;
  email?: string;
  status?: StaffStatus;
  password?: string;
};

export type CreateStaffPayload = {
  username: string;
  email: string;
  password: string;
};

export const STAFF_APIS = [
  { name: "listStaffs", method: "GET", path: "/api/v1/staffs" },
  { name: "getStaff", method: "GET", path: "/api/v1/staffs/{id}" },
  { name: "createStaff", method: "POST", path: "/api/v1/staffs" },
  { name: "updateStaff", method: "PATCH", path: "/api/v1/staffs/{id}" },
  { name: "deleteStaff", method: "DELETE", path: "/api/v1/staffs/{id}" },
] as const;

export const listStaffs = async () => {
  const response = await apiClient.get<Staff[]>("/api/v1/staffs");
  return response.data;
};

export const getStaff = async (staffId: number) => {
  const response = await apiClient.get<Staff>(`/api/v1/staffs/${staffId}`);
  return response.data;
};

export const createStaff = async (payload: CreateStaffPayload) => {
  const response = await apiClient.post<Staff>("/api/v1/staffs", {
    staff: payload,
  });
  return response.data;
};

export const updateStaff = async (
  staffId: number,
  payload: StaffPayload,
) => {
  const response = await apiClient.patch<Staff>(`/api/v1/staffs/${staffId}`, {
    staff: payload,
  });
  return response.data;
};

export const deleteStaff = async (staffId: number) => {
  await apiClient.delete(`/api/v1/staffs/${staffId}`);
};
