import React from "react";
import { useAuthStore } from "../store/authStore";
import { useModalStore } from "../store/uiStore";

const Protected = ({ children }) => {
  const token = useAuthStore((state) => state.token);
  const openLoginModal = useModalStore((state) => state.openLoginModal);

  if (!token) {
    openLoginModal();
    return null; 
  }

  return children;
};

export default Protected;
