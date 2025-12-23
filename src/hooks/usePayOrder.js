import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useAuthStore } from "../store/authStore";

const payOrderFn = async (orderId) => {
  const token = useAuthStore.getState().token;

  const { data } = await axios.get(
    `${import.meta.env.VITE_PORT_URL}/pay/${orderId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return data;
};

export const usePayOrder = () => {
  return useMutation({
    mutationFn: payOrderFn,
  });
};
