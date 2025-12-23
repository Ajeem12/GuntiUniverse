import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../store/authStore";
import { useMutation } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_PORT_URL;

const changePackage = async ({ packageId, address_id }) => {
  const token = useAuthStore.getState().token;
  const { data } = await axios.post(
    `${API_URL}/buy_package_address_change/${packageId}`,
    { address_id },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return data;
};

export const useChangePackage = () =>
  useMutation({
    mutationFn: changePackage,
  });

const getPackage = async () => {
  const token = useAuthStore.getState().token;

  const { data } = await axios.get(`${API_URL}/buy_package_list`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};

export const useGetPackage = () =>
  useQuery({
    queryKey: ["getPackage"],
    queryFn: getPackage,
    enabled: true,
    retry: false,
    refetchOnWindowFocus: false,
  });
