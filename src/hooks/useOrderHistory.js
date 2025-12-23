import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuthStore } from "../store/authStore";

const API_URL = import.meta.env.VITE_PORT_URL;

// const fetchOrderHistory = async () => {
//   const { token } = useAuthStore.getState();
//   const { data } = await axios.get(`${API_URL}/order_history`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   return data;
// };

const fetchOrderHistory = async () => {
  const { token } = useAuthStore.getState();

  try {
    const { data } = await axios.get(`${API_URL}/order_history`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    // Safely extract error message
    const message =
      error.response?.data?.message || error.message || "Something went wrong";

    // You can also handle specific 401 (Unauthenticated) here
    if (error.response?.status === 401) {
      console.warn("User is unauthenticated. Logging out...");
      // Optionally clear token or redirect
      useAuthStore.getState().logout?.();
    }

    throw new Error(message);
  }
};

export const useFetchOrderHistory = () => {
  const token = useAuthStore.getState().token;

  const query = useQuery({
    queryKey: ["orderHistory"],
    queryFn: () => fetchOrderHistory(),
    enabled: !!token,
    retry: false,
  });

  return {
    ...query,
    refetch: query.refetch,
  };
};
