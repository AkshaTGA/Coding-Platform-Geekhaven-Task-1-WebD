import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const HeroPage = () => {






    const navigator=useNavigate()
  return (
    <section className="min-h-screen flex items-center justify-center bg-black text-white relative ">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-700 via-black to-gray-800 opacity-50" />

      <motion.div
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center px-6 max-w-3xl"
      >
        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
           
          Code <span className="text-purple-500">Faster.</span>
          <br /> <span className="text-blue-500">Think</span> Smarter.
        </h1>
        <p className="mt-6 text-lg md:text-xl text-gray-400">
          Analyze, debug, and fine-tune your code to ace competitive programming challenges.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <button className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-lg flex items-center gap-2" onClick={()=>{
                navigator("/login")
            }}>
            Get Started <ArrowRight size={18} />
          </button>
          
        </div>
      </motion.div>
    </section>
  );
};
