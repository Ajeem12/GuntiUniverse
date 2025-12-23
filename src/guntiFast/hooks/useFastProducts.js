import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function useFastProducts() {
  return useQuery({
    queryKey: ["fast-products"],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_PORT_URL}/get_cmart_products`
      );
      return res.data.data;
    },
  });
}
