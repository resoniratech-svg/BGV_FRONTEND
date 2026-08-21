// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://127.0.0.1:5000/api/v1",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// api.interceptors.request.use((config) => {

//   const token = localStorage.getItem("token");

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });

// export default api;


import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://bgv-bgv-main-backend.rrh5yv.easypanel.host/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {

    const token =
      localStorage.getItem("token");

    if (token) {

      config.headers = config.headers || {};

      config.headers.Authorization =
        `Bearer ${token}`;

    }

    return config;

  }
);

export default api;