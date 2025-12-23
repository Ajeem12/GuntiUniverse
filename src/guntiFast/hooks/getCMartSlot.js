import axios from "axios";

// export const getCMartSlot = async () => {
//   const res = await axios.get(`${import.meta.env.VITE_PORT_URL}/getcmartslot`);

//   return res.data?.[0]?.data || [];
// };

export const getFastStatus = async () => {
  const res = await axios.get(`${import.meta.env.VITE_PORT_URL}/getcmartslot`);

  const slots = res.data?.[0]?.data || [];

  // OPEN if ANY slot has status = 1
  const isOpen = slots.some((slot) => Number(slot.status) === 1);

  return isOpen; // true / false
};
