import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://bgv-bgv-main-backend.rrh5yv.easypanel.host/api/v1";

const API = axios.create({
  baseURL: API_BASE_URL,
});

// ===============================
// Attach JWT Token Automatically
// ===============================
API.interceptors.request.use((config) => {

  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;

});

export interface LoginResponse {
  access_token: string;
  username: string;
  role: string;
}

// ===============================
// LOGIN
// ===============================
export const loginUser = async (
  username: string,
  password: string
): Promise<LoginResponse> => {

  const response = await API.post(
    "/auth/login",
    {
      username,
      password
    }
  );

  return response.data;
};

// ===============================
// REGISTER USER
// ===============================
export const registerUser = async (
  payload: {
    username: string;
    full_name?: string;
    email?: string;
    phone?: string;
    role: string;
    password?: string;
  }
) => {

  const response = await API.post(
    "/auth/register",
    payload
  );

  return response.data;
};

// ===============================
// GET ALL USERS
// ===============================
export const getUsers = async () => {

  const response = await API.get(
    "/users/"
  );

  return response.data;
};

// ===============================
// UPDATE USER
// ===============================
export const updateUser = async (
  id: number,
  payload: {
    username: string;
    role: string;
    password?: string;
    full_name?: string;
    email?: string;
    phone?: string;
  }
) => {

  const response = await API.put(
    `/users/${id}`,
    payload
  );

  return response.data;
};

// ===============================
// ACTIVATE / SUSPEND USER
// ===============================
export const toggleUserStatus = async (
  userId: number
) => {

  const response = await API.put(
    `/users/${userId}/status`
  );

  return response.data;
};

// ===============================
// DELETE USER
// ===============================
export const deleteUserApi = async (
  id: number
) => {

  const response = await API.delete(
    `/users/${id}`
  );

  return response.data;
};

// ===============================
// CURRENT LOGGED-IN USER
// ===============================
export const getCurrentUser = async () => {

  const response = await API.get(
    "/auth/me"
  );

  return response.data;
};


// ===============================
// CHANGE USER PASSWORD
// ===============================

export const changePassword = async (
  currentPassword: string,
  newPassword: string
) => {

  const response = await API.post(
    "/auth/change-password",
    {
      current_password: currentPassword,
      new_password: newPassword
    }
  );

  return response.data;
};
// ===============================
// CHANGE USER PROFILE
// ===============================

export const updateProfile = async (
  profile: {
    username: string;
    full_name: string;
    email: string;
    phone: string;
  }
) => {

  const response =
    await API.put(
      "/auth/update-profile",
      profile
    );

  return response.data;
};

// ===============================
// FORGOT PASSWORD
// ===============================

export const forgotPassword = async (
  email: string
) => {

  const response =
    await API.post(
      "/auth/forgot-password",
      {
        email
      }
    );

  return response.data;
};