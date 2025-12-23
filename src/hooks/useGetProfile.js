import { useState, useEffect } from "react";
import axios from "axios";
import { useAuthStore } from "../store/authStore";

const API_URL = import.meta.env.VITE_PORT_URL;

const useGetProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = useAuthStore.getState().token;

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${API_URL}/fetch_profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return setProfile(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || error.message || "Something went wrong"
      );
      if (err.response?.status === 401) {
        console.warn("User is unauthenticated. Logging out...");
        useAuthStore.getState().logout?.();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return { profile, loading, error };
};

export default useGetProfile;
