import React from "react";
import { motion } from "framer-motion";

const SpinningCirclesLoader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#000]">
      <div className="relative w-24 h-24 flex items-center justify-center">
        <motion.div
          className="absolute w-18 h-18 border-4 border-blue-500 rounded-full border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        ></motion.div>

        <motion.div
          className="absolute w-14 h-14 border-4 border-red-500 rounded-full border-t-transparent"
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
        ></motion.div>

        <motion.div
          className="absolute w-10 h-10 border-4 border-green-500 rounded-full border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        ></motion.div>
      </div>
    </div>
  );
};

export default SpinningCirclesLoader;
