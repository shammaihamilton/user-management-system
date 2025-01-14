import axios, { AxiosRequestConfig, AxiosError } from "axios";
// import { useSelector } from "react-redux";


export enum AxiosMethods {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

// Create an Axios instance
const apiClient = axios.create({
  baseURL: "https://server-n42x.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// const token = useSelector((state: any) => state.auth.token);
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

// Request interceptor with better error handling
apiClient.interceptors.request.use(
  (config) => {
    // const token = useSelector((state: any) => state.auth.token);
    const token = getToken();
    if (token) {
      config.headers.Authorization = `${token}`;
      // Log request for debugging (remove in production)
      console.log("Making request with token:", token.substring(0, 10) + "...");
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

// Response interceptor with comprehensive error handling
apiClient.interceptors.response.use(
  (response) => {
    // Log successful responses (remove in production)
    console.log(
      `Success response from ${response.config.url}:`,
      response.status
    );
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
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 403:
          // Handle forbidden
          console.error("Forbidden - possible token expiration");
          window.location.href = '/login';
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

// Improved API request function with better typing and error handling
export const apiRequest = async <T>(
  method: AxiosMethods,
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    // Log request details (remove in production)
    console.log(`Making ${method} request to ${url}`);

    const response = await apiClient.request<T>({
      method,
      url,
      data,
      ...config,
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Enhanced error handling with more details
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
