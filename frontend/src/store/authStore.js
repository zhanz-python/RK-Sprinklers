import { create } from "zustand";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/auth`;

axios.defaults.withCredentials = true;

const scheduleAutoLogout = () => {
    const logoutTime = parseInt(localStorage.getItem("logoutTime"), 10);
    if (!logoutTime) return;

    const timeout = logoutTime - Date.now();
    if (timeout > 0) {
        setTimeout(() => {
            useAuthStore.getState().logout();
            localStorage.removeItem("logoutTime");
        }, timeout);
    } else {
        useAuthStore.getState().logout();
        localStorage.removeItem("logoutTime");
    }
};

export const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    error: null,
    isLoading: false,
    isCheckingAuth: true,
    message: null,
    redirectPath: "/", 

    setRedirectPath: (path) => set({ redirectPath: path }),

    setUser: (user) => set({ user }),

signup: async (email, password, name, number, street, city, zipCode) => {
    set({ isLoading: true, error: null });
    try {
        const response = await axios.post(`${API_URL}/signup`, {
            email,
            password,
            name,
            number,
            street,
            city,
            zipCode
        });
        set({ user: response.data.user, isAuthenticated: true, isLoading: false });
    } catch (error) {
        set({ error: error.response?.data?.message || "Error signing up", isLoading: false });
        throw error;
    }
},

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/login`, { email, password });
            set((state) => ({
                isAuthenticated: true,
                user: response.data.user,
                error: null,
                isLoading: false,
                redirectPath: state.redirectPath || "/"
            }));

            const logoutTime = Date.now() + 3600000;
            localStorage.setItem("logoutTime", logoutTime);
            scheduleAutoLogout();


        } catch (error) {
            set({ error: error.response?.data?.message || "Error logging in", isLoading: false });
            throw error;
        }
    },

    logout: async () => {
        set({ isLoading: true, error: null });
        try {
            await axios.post(`${API_URL}/logout`);
            set({ user: null, isAuthenticated: false, error: null, isLoading: false, redirectPath: "/" });
        } catch (error) {
            set({ error: "Error logging out", isLoading: false });
            throw error;
        }
    },

    verifyEmail: async (code) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/verify-email`, { code });
            set({ user: response.data.user, isAuthenticated: true, isLoading: false });
            return response.data;
        } catch (error) {
            set({ error: error.response?.data?.message || "Error verifying email", isLoading: false });
            throw error;
        }
    },

    resendVerificationEmail: async (email) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/resend-verification-email`, { email });
            set({ message: response.data.message, isLoading: false });
            return response.data;
        } catch (error) {
            set({
                isLoading: false,
                error: error.response?.data?.message || "Error resending verification code",
            });
            throw error;
        }
    },

    checkAuth: async () => {
        set({ isCheckingAuth: true, error: null });
        try {
            const response = await axios.get(`${API_URL}/check-auth`);
            set({ user: response.data.user, isAuthenticated: true, isCheckingAuth: false });

            scheduleAutoLogout();

        } catch (error) {
            set({ error: null, isCheckingAuth: false, isAuthenticated: false });
        }
    },

    forgotPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/forgot-password`, { email });
            set({ message: response.data.message, isLoading: false });
        } catch (error) {
            set({
                isLoading: false,
                error: error.response?.data?.message || "Error sending reset password email",
            });
            throw error;
        }
    },

    resetPassword: async (token, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/reset-password/${token}`, { password });
            set({ message: response.data.message, isLoading: false });
        } catch (error) {
            set({
                isLoading: false,
                error: error.response?.data?.message || "Error resetting password",
            });
            throw error;
        }
    },
}));
