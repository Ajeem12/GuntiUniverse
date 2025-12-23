import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useAuthStore } from "../store/authStore";

const walletFn = async () => {
  const token = useAuthStore.getState().token;

  const { data } = await axios.get(
    `${import.meta.env.VITE_PORT_URL}/wallet_amount`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return data;
};

export const useWallet = () => {
  return useMutation({
    mutationFn: walletFn,
  });
};
