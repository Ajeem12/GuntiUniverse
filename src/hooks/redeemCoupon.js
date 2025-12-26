import axios from "axios";
import { useAuthStore } from "../store/authStore";
const API_URL = import.meta.env.VITE_PORT_URL;

export const redeemCouponRequest = async ({ couponCode }) => {
  const token = useAuthStore.getState().token;
  const response = await axios.post(
    `${API_URL}/redeem_gift_coupon`,
    {
      coupon_code: couponCode,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};
