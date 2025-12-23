// import { useQuery } from "@tanstack/react-query";
// import axios from "axios";

// const API_URL = import.meta.env.VITE_PORT_URL;

// const fetchHomeProducts = async ({ queryKey }) => {
//   const [_key, page, limit] = queryKey;

//   const { data } = await axios.get(
//     `${API_URL}/home_page_cat_product?page=${page}&limit=${limit}`
//   );

//   return data;
// };

// export const useHomeProducts = (page, limit) =>
//   useQuery({
//     queryKey: ["homeproducts", page, limit],
//     queryFn: fetchHomeProducts,
//     retry: false,
//     refetchOnWindowFocus: false,
//     keepPreviousData: true,
//   });

import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

const API_URL = import.meta.env.VITE_PORT_URL;

const fetchHomeProducts = async ({ pageParam = 1 }) => {
  const { data } = await axios.get(
    `${API_URL}/home_page_cat_product?page=${pageParam}&limit=1`
  );
  return data;
};

export const useHomeProducts = () =>
  useInfiniteQuery({
    queryKey: ["homeproducts"],
    queryFn: fetchHomeProducts,
    getNextPageParam: (lastPage, allPages) => {
      // Check if last page has data
      const hasData = Object.keys(lastPage || {}).length > 0;
      return hasData ? allPages.length + 1 : undefined;
    },
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
