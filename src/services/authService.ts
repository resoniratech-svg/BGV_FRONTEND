import api from "../api/axios";

interface LoginResponse {
  token: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export const loginUser = async (
  email: string,
  password: string
): Promise<LoginResponse> => {

  try {

    const response = await api.post(
      "/auth/login",
      {
        email,
        password,
      }
    );

    return response.data;

  } catch (error) {

    console.error(
      "Login API Error:",
      error
    );

    throw error;
  }
};