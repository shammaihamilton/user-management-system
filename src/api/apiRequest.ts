import axios, { AxiosRequestConfig, AxiosError } from "axios";
// import { useSelector } from "react-redux";

export enum AxiosMethods {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

const apiClient = axios.create({
  baseURL: "https://server-n42x.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// Improve token getter to handle different storage methods
export let getToken: () => string | null = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.warn("No token found in localStorage");
    return null;
  }
  return token;
};
export const setTokenGetter = (getter: () => string | null) => {
  getToken = getter;
};

// Request interceptor error handling
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `${token}`;
    } else {
      console.warn("No token available for request:", config.url);
    }
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    if (error.response) {
      const { status, data } = error.response;
      console.error(`API Error [${status}]:`, data);

      switch (status) {
        case 401:
          // Handle unauthorized
          console.error("Unauthorized - clearing token");
          localStorage.removeItem("token");
          window.location.href = "/login";
          break;
        case 403:
          // Handle forbidden
          console.error("Forbidden - possible token expiration");
          window.location.href = "/login";
          break;
        case 404:
          console.error("Resource not found:", error.config?.url);
          break;
        case 500:
          console.error("Server error:", data);
          break;
      }
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }
    return Promise.reject(error);
  }
);

export const apiRequest = async <T>(
  method: AxiosMethods,
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await apiClient.request<T>({
      method,
      url,
      data,
      ...config,
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message;
      const status = error.response?.status;

      console.error(`API Request Failed:`, {
        status,
        url,
        method,
        message: errorMessage,
        error,
      });

      throw new Error(`Request failed: ${errorMessage} (${status})`);
    }

    console.error("Unexpected error:", error);
    throw new Error("An unexpected error occurred");
  }
};
