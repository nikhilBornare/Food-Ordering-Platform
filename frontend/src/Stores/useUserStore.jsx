import { create } from "zustand";
import axios from "@/lib/axios.js"
import { toast } from "sonner";

export const useUserStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isCheckingAuth: true,
  loading: false,


  signup: async (input) => {
    set({ loading: true })
    try {
      const res = await axios.post("/auth/signup", input)

      toast.success(res.data.message, { id: "signupSuccess" })
      set({ user: res.data.user, isAuthenticated: true, loading: false })

    } catch (error) {
      set({ loading: false })
      toast.error(error.response.data.message, { id: "signupError" })
    }
  },

  login: async (input) => {
    set({ loading: true })
    try {
      const res = await axios.post("/auth/login", input)
      toast.success(res.data.message, { id: "loginSuccess" })
      set({ user: res.data.user, isAuthenticated: true, loading: false })
    } catch (error) {
      set({ loading: false })
      toast.error(error.response.data.message, { id: "loginError" })
    }
  },

  verifyEmail: async (verificationCode) => {
    set({ loading: true })
    try {
      const res = await axios.post("/auth/verify-email", { verificationToken: verificationCode })
      toast.success(res.data.message, { id: "verifyEmailSuccess" })
      set({ user: res.data.user, isAuthenticated: true, loading: false })

    } catch (error) {
      set({ loading: false })
      toast.error(error.response.data.message, { id: "verifyEmailError" })
    }
  },

  logout: async () => {
    set({ loading: true })
    try {
      const res = await axios.post("/auth/logout")
      toast.success(res.data.message, { id: "logoutSuccess" })
      set({ user: null, isAuthenticated: false, loading: false })

    } catch (error) {
      set({ loading: false })
      toast.error(error.response.data.message, { id: "logoutError" })
    }
  },

  forgotPassword: async (email) => {
    set({ loading: true })
    try {
      const res = await axios.post("/auth/forgot-password", { email })
      toast.success(res.data.message, { id: "forgotPasswordSuccess" })

    } catch (error) {
      toast.error(error.response.data.message, { id: "forgotPasswordError" })
    }
    set({ loading: false })
  },

  resetPassword: async (resetToken, password,) => {
    try {
      const res = await axios.post(`auth/reset-password/${resetToken}`, { newPassword: password, })
      toast.success(res.data.message, { id: "resetPasswordSuccess" })

    } catch (error) {
      set({ loading: false })
      toast.error(error.response.data.message, { id: "resetPasswordError" })


    }
  },

  updateProfile: async (profileData) => {
    set({ loading: true })
    try {
      const res = await axios.put("/auth/profile/update", profileData)
      toast.success(res.data.message, { id: "updateProfileSuccess" })
      set({ user: res.data.user, loading: false, isAuthenticated: true })

    } catch (error) {
      set({ loading: false })
      toast.error(error.response.data.message, { id: "updateProfileError" })

    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true })
    try {
      const res = await axios.get("/auth/check-auth",)
      set({ user: res.data.user, isAuthenticated: true, isCheckingAuth: false })

    } catch (error) {
      set({ isCheckingAuth: false })
     // toast.error(error.response.data.message, { id: "checkAuthError" })
    }
  },
  refreshToken: async () => {
    if (get().isCheckingAuth) return;
    set({ isCheckingAuth: true });
    try {
      const response = await axios.post("/auth/refresh-token");
      set({ isCheckingAuth: false });
      return response.data;
    } catch (error) {
      set({ user: null, isCheckingAuth: false });
      throw error;
    }
  },

}));

let refreshPromise = null;
axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                if(refreshPromise){
                    await refreshPromise;
                    return axios(originalRequest);
                }

                refreshPromise = useUserStore.getState().refreshToken();
                await refreshPromise;
                refreshPromise = null;

                return axios(originalRequest);
            } catch (refreshError) {
                useUserStore.getState().logout();
                return Promise.reject(refreshError);
                
            }
        }
        return Promise.reject(error);
    }
);
