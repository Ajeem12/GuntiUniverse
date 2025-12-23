import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function useFastCatProducts(id) {
  return useQuery({
    queryKey: ["fast-products", id],
    queryFn: async () => {
      const res = await axios.get(
        `${
          import.meta.env.VITE_PORT_URL
        }/getcmartcategoriesproductaccslot/${id}`
      );
      return res.data;
    },
    enabled: !!id,
  });
}
