import axios from "axios";
import { ENV } from "./env";

// 공통 axios 인스턴스 (아직은 얇게)
export const api = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 10000,
});