// Import axios library để gửi HTTP requests
import axios from "axios";

/**
 * Base URL của backend API
 * Lấy từ biến môi trường Vercel (nếu có), nếu không sẽ fallback về localhost
 */
const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

// Interceptor để tự động gắn Token vào request nếu có
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (username, password) => {
  const res = await axios.post(`${API_BASE}/users/login/`, { username, password });
  return res.data;
};

export const register = async (username, email, password) => {
  const res = await axios.post(`${API_BASE}/users/register/`, { username, email, password });
  return res.data;
};

export const submitTestResult = async (data) => {
  const res = await axios.post(`${API_BASE}/users/test-result/`, data);
  return res.data;
};

export const getTestResult = async () => {
  const res = await axios.get(`${API_BASE}/users/test-result/`);
  return res.data;
};

export const sendMessage = async (conversationId, message) => {
  // Tạo payload object
  const payload = {
    // Nội dung message từ user
    message: message,
  };

  // Chỉ thêm conversationId vào payload nếu nó có giá trị thật
  // Nguyên do: backend sẽ tạo conversation mới nếu không có ID
  if (conversationId) {
    payload.conversation_id = conversationId;
  }

  // Gửi POST request tới API endpoint
  // axios.post(url, data) trả về Promise<AxiosResponse>
  const response = await axios.post(`${API_BASE}/chat/`, payload);

  /**
   * Backend response format:
   * {
   *   conversation_id: "uuid-here",
   *   reply: "Assistant response text"
   * }
   */
  return response.data;
};

export const ingestAdminData = async (formData) => {
    const response = await axios.post(`${API_BASE}/ai/ingest/`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};