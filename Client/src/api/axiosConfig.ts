import axios from "axios";

// NOTE: Replace port 5028 with your own API port.
const BASE_URL = "http://localhost:5028/api";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
