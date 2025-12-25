import axios from "axios";
import { useMutation } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_PORT_URL;

const gfastSearch = async (product_name) => {
  const { data } = await axios.post(
    `${API_URL}/c_mart_product_serach`,
    { product_name },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return data;
};

const useFastSearch = () => {
  return useMutation({
    mutationFn: gfastSearch,
  });
};

export default useFastSearch;
