import { toast } from "sonner"
import { create } from "zustand"
import axios from "@/lib/axios.js"

export const useRestaurantStore = create((set) => ({
  restaurant: undefined,
  restaurantOrders: [],

  searchedRestaurant: undefined,
  appliedFilter: [],
  loading: false,

  singleRestaurant: null,

  filterOptions : [],

  getRestaurant: async () => {
    set({ loading: true })
    try {
      const res = await axios.get("/restaurant")
      set({ restaurant: res.data.restaurant, loading: false })

    } catch (error) {
      set({ loading: false })
      toast.error(error.response.data.message, { id: "getRestaurantError" })

    }
  },

  getRestaurantOrders: async () => {
    set({ loading: true })
    try {
      const res = await axios.get("/restaurant/orders")
      set({ restaurantOrders: res.data.orders, loading: false })
      
    } catch (error) {
      set({ loading: false })
      toast.error(error.response.data.message, { id: "getRestaurantError" })      
    }
  },
  
  updateOrderStatus: async (orderId, status) => {
    set({ loading: true })
    try {
      const res = await axios.put(`/restaurant/order/${orderId}`, { status })
      toast.success(res.data.message, { id: "updateOrderStatusSuccess" })
      set({ loading: false })

    } catch (error) {
      set({ loading: false })
      toast.error(error.response.data.message, { id: "updateOrderStatusError" })
    }
  },

  createRestaurant: async (restaurantData) => {
    set({ loading: true })
    try {
      const res = await axios.post("/restaurant", restaurantData)
      toast.success(res.data.message, { id: "createRestaurantSuccess" })
      set({ restaurant: res.data, loading: false })

    } catch (error) {
      set({ loading: false })
      toast.error(error.response.data.message, { id: "createRestaurantError" })

    }
  },

  updateRestaurant: async (restaurantData) => {
    set({ loading: true })
    try {
      const res = await axios.put("/restaurant", restaurantData)
      toast.success(res.data.message, { id: "updateRestaurantSuccess" })
      set({ restaurant: res.data.restaurant, loading: false })

    } catch (error) {
      set({ loading: false })
      toast.error(error.response.data.message, { id: "updateRestaurantError" })

    }
  },

  searchRestaurant: async (searchText, appliedFilter, searchQuery) => {
    // set({ loading: true })
    try {
      const params = new URLSearchParams()
      params.set("searchQuery", searchQuery)
      params.set("appliedFilter", appliedFilter)

      const res = await axios.get(`/restaurant/search/${searchText}?${params.toString()}`)
      set({ searchedRestaurant: res.data.restaurants, loading: false })
      set({filterOptions: res.data.cuisinesList})

    } catch (error) {
      set({ loading: false })
      toast.error(error.response.data.message, { id: "searchRestaurantError" })
    }
  },
  setAppliedFilter: (value) => {
    set((state) => {
      const isAlreadyApplied = state.appliedFilter.includes(value);
      const updatedFilter = isAlreadyApplied ? state.appliedFilter.filter((item) => item !== value) : [...state.appliedFilter, value];
      return { appliedFilter: updatedFilter }
    })
  },
  resetAppliedFilter: () => {
    set({ appliedFilter: [] })
  },

  getSingleRestaurant: async (restaurantId) => {
    set({ loading: true })
    try {
      const res = await axios.get(`/restaurant/${restaurantId}`)
      set({ singleRestaurant: res.data.restaurant, loading: false })

    } catch (error) {
      set({ loading: false })
      toast.error(error.response.data.message, { id: "getSingleRestaurantError" })

    }
  },



}))