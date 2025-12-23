import React from 'react'
import { motion } from "framer-motion";
const Guntiimg = () => {
  return (
    <div>
         <motion.img
        src="/img/icon.png"
        alt="Floating Icon"
        className="fixed bottom-20 md:bottom-8 right-1 md:left-4 w-[90px] md:w-[150px] cursor-pointer z-50"
        drag
        dragMomentum={false}
        dragElastic={0.2}
        animate={{
          y: [0, -10, 0], 
        }}
        initial={{ y: 0 }}
        transition={{
          duration: 3,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />
    </div>
  )
}

export default Guntiimg