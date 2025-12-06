import axios from "axios";

// DİKKAT: Buradaki 5028 numarasını kendi API portunla değiştir!
const BASE_URL = "http://localhost:5028/api";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
