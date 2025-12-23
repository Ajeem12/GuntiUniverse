import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useAuthStore } from "../store/authStore";

const API_URL = import.meta.env.VITE_PORT_URL;

// Function to update user amount via POST
const updateUserAmount = async ({ type, token }) => {
  const payload = { type };

  const { data } = await axios.post(`${API_URL}/setting_page_api`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};

// React Query mutation hook
export const useUpdateUserAmount = () => {
  const token = useAuthStore.getState().token;

  return useMutation({
    mutationFn: (variables) => updateUserAmount({ ...variables, token }),
  });
};
