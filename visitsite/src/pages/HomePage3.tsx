import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRightIcon, Loader2Icon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  const [timeLeft, setTimeLeft] = useState(900);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="/IMG_4245a-small.jpg"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 backdrop-blur-sm bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">

        {/* Logo */}
        <motion.div
          animate={{ rotateY: [0, 15, -15, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <img
            src="/simats_logo_400x400-3.png"
            className="w-32 h-32 mb-8 drop-shadow-2xl"
          />
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-5xl md:text-6xl font-bold text-white drop-shadow-xl mb-4"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
        >
          SERVER UNDER MAINTENANCE
        </motion.h1>

        {/* Timer */}
        <div className="text-2xl text-emerald-300 mb-8">
          Please Wait: <span className="text-white">{formatTime(timeLeft)}</span>
        </div>

        {/* Loader */}
        <Loader2Icon className="w-12 h-12 text-white animate-spin mb-10" />

        

      </div>
    </div>
  );
}
