import axios from 'axios';

const axiosInstance = axios.create({});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");
      
      if(!refreshToken) {
        return Promise.resolve();
      }

      try {
        const res = await axios.post('auth/refresh',{ refreshToken }, {
          withCredentials: true
        });
        
        const {token: accessToken, refreshToken: newRefreshToken} = res.data;

        localStorage.setItem("refreshToken", newRefreshToken);

        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        if(!window.location.href.includes('/login')){
          window.location.href = '/login';
        }

        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);


export default axiosInstance;