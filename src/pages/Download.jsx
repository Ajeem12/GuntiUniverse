import React, { useEffect } from "react";
import Loader from "../components/Loader";

const Download = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href =
        "https://play.google.com/store/apps/details?id=com.gunti.guntiuniverse&pli=1";
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader />
    </div>
  );
};

export default Download;
