import axios from "axios";

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getMyUser = async () => {
  const response = await axios.get("/auth/me");
  return response.data;
}
