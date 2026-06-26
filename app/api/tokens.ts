import apiClient from "./axios";

export type TokenStatus = "pending" | "in_progress" | "completed" | "cancelled";

export type QueueToken = {
  id: number;
  token_code: string;
  status: TokenStatus;
  queue_position: number | null;
  completed_at?: string | null;
  service?: {
    id: number;
    name: string;
  } | null;
  user?: {
    id: number;
    username: string;
    phone?: string;
    credit_score?: number;
  } | null;
  created_at: string;
};

export const TOKEN_APIS = [
  { name: "listTokens", method: "GET", path: "/api/v1/tokens" },
  { name: "createToken", method: "POST", path: "/api/v1/tokens" },
  {
    name: "updateTokenStatus",
    method: "PATCH",
    path: "/api/v1/tokens/{id}/update_status",
  },
  { name: "leaveToken", method: "PATCH", path: "/api/v1/tokens/{id}/leave" },
  { name: "deleteToken", method: "DELETE", path: "/api/v1/tokens/{id}" },
] as const;

export const listTokens = async () => {
  const response = await apiClient.get<QueueToken[]>("/api/v1/tokens");
  return response.data;
};

export const createToken = async (serviceId: number) => {
  const response = await apiClient.post<QueueToken>("/api/v1/tokens", {
    service_id: serviceId,
  });
  return response.data;
};

export const updateTokenStatus = async (
  tokenId: number,
  status: Extract<TokenStatus, "pending" | "in_progress" | "completed">,
) => {
  const response = await apiClient.patch<QueueToken>(
    `/api/v1/tokens/${tokenId}/update_status`,
    { status },
  );
  return response.data;
};

export const deleteToken = async (tokenId: number) => {
  await apiClient.delete(`/api/v1/tokens/${tokenId}`);
};

export const leaveToken = async (tokenId: number) => {
  const response = await apiClient.patch<{ message?: string }>(
    `/api/v1/tokens/${tokenId}/leave`,
  );
  return response.data;
};
