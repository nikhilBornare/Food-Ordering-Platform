import { toast } from "sonner"
import { create } from "zustand"
import axios from "@/lib/axios.js"

export const useMenuStore = create((set) => ({
    menus: [],
    loading: false,

    getMenus: async () => {
        set({ loading: true });
        try {
            const res = await axios.get("/menu");
            set({ menus: res.data.menus, loading: false });
        } catch (error) {
            set({ loading: false });
            toast.error(error.response.data.message, { id: "getMenusError" });
        }
    },

    addMenu: async (menuData) => {
        // set({ loading: true });
        try {
            const res = await axios.post("/menu", menuData);
            toast.success(res.data.message, { id: "addMenuSuccess" });
            set((state) => ({ menus: [...state.menus, res.data.menu], loading: false, }));
        } catch (error) {
            set({ loading: false });
            toast.error(error.response.data.message, { id: "addMenuError" });
        }
    },

    editMenu: async (selectedMenuId, formData) => {
        set({ loading: true });
        try {
            const res = await axios.put(`/menu/${selectedMenuId}`, formData);
            toast.success(res.data.message, { id: "editMenuSuccess" });
            set((state) => ({
                menus: state.menus.map((menu) => menu._id === selectedMenuId ? res.data.menu : menu),
                loading: false,
            }));

        } catch (error) {
            set({ loading: false });
            toast.error(error.response.data.message, { id: "editMenuError" });
        }
    },

    deleteMenu: async (menuId) => {
        // set({ loading: true });
        try {
            const res = await axios.delete(`/menu/${menuId}`);
            toast.success(res.data.message, { id: "deleteMenuSuccess" });
            set((state) => ({
                menus: state.menus.filter((menu) => menu._id !== menuId),
                loading: false,
            }));
        } catch (error) {
            set({ loading: false });
            toast.error(error.response.data.message, { id: "deleteMenuError" });
        }
    }
}));
