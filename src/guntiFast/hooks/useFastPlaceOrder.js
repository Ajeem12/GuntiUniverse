import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../../store/authStore";

const API_URL = import.meta.env.VITE_PORT_URL;

const placeOrderRequest = async ({ payload, token }) => {
  const { data } = await axios.post(`${API_URL}/c_mart_place_order`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

const useFastPlaceOrder = () => {
  const token = useAuthStore((state) => state.token);

  const mutation = useMutation({
    mutationFn: (payload) => placeOrderRequest({ payload, token }),
  });
  return mutation;
};

export default useFastPlaceOrder;
