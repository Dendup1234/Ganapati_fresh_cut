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
  {
    name: "advanceToken",
    method: "PATCH",
    path: "/api/v1/tokens/{id}/advance",
  },
] as const;

export const listTokens = async () => {
  const response = await apiClient.get<QueueToken[]>("/api/v1/tokens");
  return response.data;
};

export const advanceToken = async (tokenId: number) => {
  const response = await apiClient.patch<QueueToken>(
    `/api/v1/tokens/${tokenId}/advance`,
  );
  return response.data;
};
