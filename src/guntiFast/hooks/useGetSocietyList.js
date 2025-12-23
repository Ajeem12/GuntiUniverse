import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../../store/authStore";

const API_URL = import.meta.env.VITE_PORT_URL;

export const useSocietyList = () => {
  const { token } = useAuthStore();

  return useMutation({
    mutationFn: async (pincode) => {
      // Create FormData
      const formData = new FormData();
      formData.append("pincode", pincode);

      const { data } = await axios.post(
        `${API_URL}/get_society_list`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return data;
    },
  });
};
