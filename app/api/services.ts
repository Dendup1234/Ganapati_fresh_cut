import apiClient from "./axios";

export type ServiceCategory = {
  id: number;
  name: string;
  active?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type AdminService = {
  id: number;
  name: string;
  price: number | string;
  description?: string | null;
  estimated_time?: string | null;
  img?: string | null;
  service_type: string[];
  category_id: number;
  created_at?: string;
  updated_at?: string;
};

export type ServicePayload = {
  name: string;
  price: number;
  description?: string | null;
  estimated_time?: string | null;
  img?: string | null;
  service_type: string[];
};

export const SERVICE_APIS = [
  { name: "listCategories", method: "GET", path: "/api/v1/categories" },
  {
    name: "toggleCategoryActive",
    method: "PATCH",
    path: "/api/v1/categories/{id}/toggle_active",
  },
  {
    name: "listServices",
    method: "GET",
    path: "/api/v1/categories/{category_id}/services",
  },
  {
    name: "getService",
    method: "GET",
    path: "/api/v1/categories/{category_id}/services/{id}",
  },
  {
    name: "createService",
    method: "POST",
    path: "/api/v1/categories/{category_id}/services",
  },
  {
    name: "updateService",
    method: "PATCH",
    path: "/api/v1/categories/{category_id}/services/{id}",
  },
  {
    name: "deleteService",
    method: "DELETE",
    path: "/api/v1/categories/{category_id}/services/{id}",
  },
] as const;

export const listCategories = async () => {
  const response = await apiClient.get<ServiceCategory[]>("/api/v1/categories");
  return response.data;
};

export const toggleCategoryActive = async (
  categoryId: number,
  active: boolean,
) => {
  const response = await apiClient.patch<ServiceCategory>(
    `/api/v1/categories/${categoryId}/toggle_active`,
    { active },
  );
  return response.data;
};

export const listServices = async (categoryId: number) => {
  const response = await apiClient.get<AdminService[]>(
    `/api/v1/categories/${categoryId}/services`,
  );
  return response.data;
};

export const getService = async (categoryId: number, serviceId: number) => {
  const response = await apiClient.get<AdminService>(
    `/api/v1/categories/${categoryId}/services/${serviceId}`,
  );
  return response.data;
};

export const createService = async (
  categoryId: number,
  payload: ServicePayload,
) => {
  const response = await apiClient.post<AdminService>(
    `/api/v1/categories/${categoryId}/services`,
    { service: payload },
  );
  return response.data;
};

export const updateService = async (
  categoryId: number,
  serviceId: number,
  payload: Partial<ServicePayload>,
) => {
  const response = await apiClient.patch<AdminService>(
    `/api/v1/categories/${categoryId}/services/${serviceId}`,
    { service: payload },
  );
  return response.data;
};

export const deleteService = async (categoryId: number, serviceId: number) => {
  const response = await apiClient.delete<{ message?: string }>(
    `/api/v1/categories/${categoryId}/services/${serviceId}`,
  );
  return response.data;
};
