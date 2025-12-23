import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_URL = import.meta.env.VITE_PORT_URL;

const fetchBanners = async (type) => {
  const { data } = await axios.get(`${API_URL}/banners?type=${type}`);
  return data;
};

export const useBanner = (type) =>
  useQuery({
    queryKey: ["banners", type],
    queryFn: () => fetchBanners(type),
    retry: true,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
