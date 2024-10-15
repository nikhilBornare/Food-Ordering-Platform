import { create } from "zustand";
import axios from "@/lib/axios";
import { toast } from "sonner";
import { loadStripe } from "@stripe/stripe-js";

export const useOrderStore = create((set, get) => ({
  customerOrders: [],
  newOrder: null,
  loading: false,

  createCheckoutSession: async (checkoutData) => {
    set({ loading: true });
    try {
      const res = await axios.post("/payment/create-checkout-session", { checkoutData });
      toast.success(res.data.message, { id: "createCheckoutSessionSuccess" });

      const stripe = await loadStripe(res.data.stripePublishableKey);
      const result = await stripe.redirectToCheckout({
        sessionId: res.data.id,
      });
      if (result.error) {
        toast.error(result.error.message, { id: 'orderCheckout' });
      }
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.message || 'Something went wrong', { id: "createCheckoutSessionError" });
    }
    set({ loading: false });
  },

  getOrderDetails: async (sessionId) => {
    set({ loading: true });
    try {
      const res = await axios.post('/payment/checkout-success', { session_id: sessionId });
      toast.success(res.data.message, { id: "getOrderDetailsSuccess" });
      set({ newOrder: res.data.newOrder, loading: false });


    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.message || 'Something went wrong', { id: "getOrderDetailsError" });
    }
  },
  getCustomerOrders: async () => {
    set({ loading: true });
    try {
      const res = await axios.get("/order");
      set({ customerOrders: res.data.orders, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.message || 'Something went wrong', { id: "getCustomerOrdersError" });
    }
  },
  cancelOrder: async (orderId) => {
    set({ loading: true });
    try {
      const res = await axios.put(`/order/${orderId}`);
      const neworder = get().customerOrders.map((order) => {
        if (order._id === orderId) {
          return { ...order, status: 'Cancelled' };
        } else {
          return order;
        }
      });
      toast.success(res.data.message, { id: "cancelOrderSuccess" });
      set({ customerOrders: neworder });


    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.message || 'Something went wrong', { id: "cancelOrderError" });
    }
  }
}));