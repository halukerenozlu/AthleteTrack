import axios from "axios";

// Translated comment.
const BASE_URL = "http://localhost:5028/api";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
