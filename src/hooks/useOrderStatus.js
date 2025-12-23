// hooks/useOrderStatus.js
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_URL = import.meta.env.VITE_PORT_URL;

const fetchOrderStatus = async (id) => {
  const { data } = await axios.get(`${API_URL}/get_order_status/${id}`);
  return data;
};

export const useOrderStatus = (transactionId) =>
  useQuery({
    queryKey: ["orderStatus", transactionId],
    queryFn: () => fetchOrderStatus(transactionId),
    enabled: !!transactionId, // Only runs if transactionId is truthy
    retry: false,
    refetchOnWindowFocus: false,
  });
