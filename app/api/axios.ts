import { create } from "axios";

const apiClient = create({
  baseURL: "http://10.2.45.15:3000",
  timeout: 10000,
  withCredentials: true,
});
export default apiClient;
