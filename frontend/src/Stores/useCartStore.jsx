import axios from "@/lib/axios.js"
import { toast } from "sonner";
import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
    cart: [],
    loading: false,

    getCart: async () => {
        set({ loading: true });
        try {
            const res = await axios.get("/cart");
            set({ cart: res.data.cart, loading: false });
        } catch (error) {
            set({ loading: false });
            toast.error(error.response.data.message, { id: "getCartError" });
        }
    },

    addToCart: async (menuId) => {
        set({ loading: true });
        try {
            const res = await axios.post("/cart", { menuId });
            set({ loading: false });
            toast.success(res.data.message, { id: "addToCartSuccess" });

        } catch (error) {
            set({ loading: false });
            toast.error(error.response.data.message, { id: "addToCartError" });
        }
    },

    updateQuantity: async (id, quantity) => {
        set({ loading: true });
        try {
            await axios.put(`/cart/${id}`, { quantity });

            const newCart = get().cart.map((item) => {
                if (item._id === id) {
                    return { ...item, quantity };
                } else {
                    return item;
                }
            });
            set({ cart: newCart });
            set({ loading: false });

        } catch (error) {
            set({ loading: false });
            toast.error(error.response.data.message, { id: "updateQuantityError" });
        }
    },

    removeFromCart: async (id) => {
        set({ loading: true });
        try {
            const res = await axios.delete(`/cart/${id}`);
            const newCart = get().cart.filter((item) => item._id !== id);
            toast.success(res.data.message, { id: "removeFromCartSuccess" });
            set({ cart: newCart, loading: false });

        } catch (error) {
            set({ loading: false });
            toast.error(error.response.data.message, { id: "removeFromCartError" });
        }
    },
    clearCart: async () => {
        set({ loading: true });
        try {
            await axios.delete("/cart");
            set({ cart: [], loading: false });
            toast.success("Cart Cleared", { id: "clearCartSuccess" });

        } catch (error) {
            set({ loading: false });
            toast.error(error.response.data.message, { id: "clearCartError" });
        }
    },
}));

