import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useAuthStore } from "../store/authStore";

const cashbackFn = async () => {
  const token = useAuthStore.getState().token;

  const { data } = await axios.get(
    `${import.meta.env.VITE_PORT_URL}/cashback_fetch_api`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return data;
};

export const useCashbackOrder = () => {
  return useMutation({
    mutationFn: cashbackFn,
  });
};
