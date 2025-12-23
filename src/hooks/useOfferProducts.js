import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_URL = import.meta.env.VITE_PORT_URL;

const fetchOfferProduct = async () => {
  const { data } = await axios.get(`${API_URL}/offer_products`);
  return data;
};

export const useOfferProducts = () =>
  useQuery({
    queryKey: ["offer_products"],
    queryFn: fetchOfferProduct,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
