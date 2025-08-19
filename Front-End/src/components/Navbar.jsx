import { Link } from "react-router-dom";

const BeforeLoginNavbar = () => {
  return (
    <nav
      className="w-full flex flex-wrap items-center justify-between gap-3 px-4 md:px-10 py-3 fixed top-0 left-0 z-[10000] 
    bg-gradient-to-r from-[#08121b]/80 via-[#071229]/70 to-[#081229]/80 backdrop-blur-xl border-b border-gray-800 shadow-md"
    >
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="w-10 h-10 rounded-md bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
          GH
        </div>
        <div className=" flex flex-col">
          <span className="text-white font-extrabold text-md sm:text-lg">GEEKHAVEN</span>
          <span className="text-xs text-gray-400 -mt-1">
            Practice • Learn • Improve
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 order-2 sm:order-3 flex-wrap">
        <Link
          to="/"
          className="px-3 py-2 rounded-lg text-sm text-gray-200 hover:bg-gray-800/60 transition"
        >
          Home
        </Link>
        
        
        <Link
          to="/signup"
          className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm"
        >
          Sign Up
        </Link>
      </div>
    </nav>
  );
};

export default BeforeLoginNavbar;
