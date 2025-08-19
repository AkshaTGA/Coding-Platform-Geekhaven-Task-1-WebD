import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import validator from "validator";
import { handlelogin } from "../../utils/login";
import BeforeLoginNavbar from "../components/Navbar";
import { notify } from "../../utils/toastmessage";
import { ToastContainer } from "react-toastify";
import { isAuthenticated } from "../../utils/checkAuth";

export const Login = () => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [error, seterror] = useState("");
  const [emailError, setemailError] = useState("");
  const [passwordError, setpasswordError] = useState("");
  const [isloading, setisloading] = useState(false);

  const navigate = useNavigate();

  const HandleLoginButtonClick = async () => {
    setemailError("");
    setpasswordError("");
    if (!email) {
      return notify("Email is a required field", "warn", 2000);
    }
    if (!password) {
      return notify("Password is a required field", "warn", 2000);
    }
    if (!validator.isEmail(email)) {
      console.log(validator.isEmail(email));
      return notify("Please Enter a valid Email", "warn", 2000);
    }
    const response = await handlelogin(email, password)
      .then(async (res) => {
        if (res.status == 429) {
          return notify(
            "Too many signup attempts. Please try again later",
            "error",
            2000
          );
        }
        return await res.json();
      })
      .then(async (res) => {
        return await res;
      });
    console.log(response);
    if (response.status == "Invalid Credentials") {
      return notify("Please provide Valid Credentials", "warn", 2000);
    } else if (response.status == "User Not Found") {
      return notify("No Existing User found", "warn", 2000);
    } else if (response.status == "Login Sucessful") {
      notify("Login Sucessful, Redirecting...", "sucess", 2000);
      setTimeout(() => {
        navigate("/problems");
      }, 3000);
    } else {
      seterror("Something Went Wrong");
    }
  };

  useEffect(() => {
    const checkauth = async () => {
      setisloading(true);
      try {
        const isAuth = await isAuthenticated();
        if (isAuth.authenticated) {
          navigate("/problems");
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error(error.message);
        navigate("/");
      } finally {
        setisloading(false);
      }
    };
    checkauth();
  }, []);

  return (
    <div>
      {!isloading && (
        <section className="min-h-screen flex items-center justify-center bg-black text-white relative ">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-700 via-black to-gray-800 opacity-50" />
          <BeforeLoginNavbar />
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 text-center m-2 px-[2vw] border-solid border py-2 rounded-2xl border-[#3a3a3a] max-w-3xl"
          >
            <ToastContainer />

            <h3 className="font-bold text-4xl">
              Log<span className="text-blue-500">in</span>
            </h3>
            <div className="flex flex-col p-3 max-w-3xl min-w-6">
              <input
                type="email"
                className=" border-[#1b1b1b]  border-[1px] w-full mt-[2vh] outline-none h-[5vh] rounded-xl focus:border-[#1b1b1b] max-w-2xl text-white p-5"
                placeholder="Email"
                onChange={(e) => {
                  return setemail(e.target.value);
                }}
              />
              <p className="text-red-200">{emailError}</p>
              <input
                type="password"
                className=" border-[#1b1b1b]  border-[1px] w-full mt-[2vh] outline-none h-[5vh] rounded-xl focus:border-[#1b1b1b] max-w-2xl text-white p-5"
                placeholder="Password"
                onChange={(e) => {
                  return setpassword(e.target.value);
                }}
              />
              <p className="text-red-200">{passwordError}</p>
            </div>
            <p className="text-red-200">{error}</p>
            <div className="mt-5  sm:p-5 flex justify-center flex-col gap-4">
              <button
                className="px-6 py-3 rounded-2xl border border-gray-600 hover:bg-[#111010] text-gray-300 font-bold"
                onClick={HandleLoginButtonClick}
              >
                Login
              </button>
              <p className="font-bold">
                Don't have an account?{" "}
                <Link
                  to={"/signup"}
                  className="ml-1 font-bold hover:text-blue-400 text-blue-500"
                >
                  Signup Here
                </Link>
              </p>
            </div>
          </motion.div>
        </section>
      )}
      {isloading && (
        <section className="min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black text-white relative">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-700 via-black to-gray-800 opacity-50" />
          <BeforeLoginNavbar />
          <span className="loader z-1000 "></span>
        </section>
      )}
    </div>
  );
};
