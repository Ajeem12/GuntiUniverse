import React from "react";
import { CircularProgress, Box } from "@mui/material";

const Loader = () => {
  return (
   <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
        {/* Loading text with fade animation */}
        <div className="animate-pulse flex space-x-2">
         <img src='/loader/image(6).jpg' className='w-12 h-12 object-contain'></img>
          
        </div>
      </div>
  );
};

export default Loader;
