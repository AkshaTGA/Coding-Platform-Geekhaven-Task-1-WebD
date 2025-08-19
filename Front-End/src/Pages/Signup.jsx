import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { handlesignup } from "../../utils/signup";
import validator from "validator";
import { useEffect, useState } from "react";
// import { validateEmail } from "../../utils/validateEmail";
import { ToastContainer } from "react-toastify";
import { notify } from "../../utils/toastmessage";
import BeforeLoginNavbar from "../components/Navbar";
import { isAuthenticated } from "../../utils/checkAuth";

export const Signup = () => {
  const [Name, setName] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [confirmpassword, setconfirmpassword] = useState("");
  // const [emailValid, setemailValid] = useState(false);
  const [isloading, setisloading] = useState(false);

  const navigate = useNavigate();

  const HandleSignupButtonClick = async () => {
    if (!Name) {
      return notify("Name is required Field", "warn", 2000);
    }
    if (!email) {
      return notify("Email is required Field", "warn", 2000);
    }
    if (!password) {
      return notify("Password is required Field", "warn", 2000);
    }

    if (!confirmpassword) {
      return notify("confirm Password is required Field", "warn", 2000);
    }
    if (confirmpassword != password) {
      return notify(
        "Password and Confirm Password Should be same",
        "warn",
        2000
      );
    }
    if (!validator.isEmail(email)) {
      return notify("Please enter a valid email", "warn", 2000);
    }

    const response = await handlesignup(Name, email, confirmpassword)
      .then(async (res) => {
        if(res.status==429){
          return notify("Too many signup attempts. Please try again later",'error',2000)
        }
        return await res.json();
      })
      .catch((err) => console.error("Something Went Wrong " + err.message));
    console.log(response);


    if (response.status == "User Already Exists") {
      return notify(
        "Another account already exist with the provided email, Please Login",
        "error"
      );
    } else if (response.status == "Signup Failed") {
      return notify("Something went Wrong", "error");
    } else if (response.status == "Signup Sucessful") {
      notify("Sucessfully Registered! Please Login.", "sucess", 2000);
      setTimeout(() => {
        notify("Redirecting to Login...", "sucess", 2000);
      }, 1000);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } else {
      return notify("Please enter a valid email", "warn");
    }
  };


  //Email vallidation via API is in development...
  // const handleValidate = async () => {
  //   if (!validator.isEmail(email)) {
  //     return notify("Please enter a valid email", "warn");
  //   }
  //   try {
  //     const valid = await validateEmail(email);
  //     if (valid) {
  //       setemailValid(true);
  //     } else {
  //       setemailValid(false);
  //       return notify(
  //         "Email Validation Failed, Please Enter a valid email",
  //         "error",
  //         2000
  //       );
  //     }
  //   } catch (error) {
  //     console.log(error.message);
  //     return notify(
  //       "Email Validation Failed, Please Try Again!",
  //       "error",
  //       2000
  //     );
  //   }
  // };

  useEffect(() => {
    const checkauth = async () => {
      setisloading(true);
      try {
        const isAuth = await isAuthenticated();
        if (isAuth.authenticated) {
          navigate("/problems");
        } else {
          navigate("/signup");
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
            className=" relative z-10 text-center m-2 px-[2vw] border-solid border py-2 rounded-2xl border-[#3a3a3a] max-w-3xl"
          >
            <ToastContainer />
            <h3 className="font-bold text-4xl">
              Sign<span className="text-blue-500">up</span>
            </h3>
            <div className="flex flex-col p-3 max-w-3xl">
              <input
                type="text"
                className="border border-[#1b1b1b] w-full mt-[2vh] h-[5vh] rounded-xl focus:border-[#1b1b1b] max-w-2xl text-white p-5 bg-black outline-none"
                placeholder="Name"
                onChange={(e) => {
                  return setName(e.target.value);
                }}
              />
              <div className="border-[#1b1b1b] mt-[2vh] h-[5vh] border-[1px] rounded-xl flex">
                <input
                  type="email"
                  className="  w-full   outline-none focus:border-[#1b1b1b] max-w-2xl text-white p-5"
                  placeholder="Email"
                  onChange={(e) => {
                    return setemail(e.target.value);
                  }}
                />{" "}
                
              </div>

              <input
                type="password"
                className=" border-[#1b1b1b]  border-[1px] w-full mt-[2vh] h-[5vh] rounded-xl outline-none focus:border-[#1b1b1b] max-w-2xl text-white p-5"
                placeholder="Password"
                onChange={(e) => {
                  return setpassword(e.target.value);
                }}
              />

              <input
                type="password"
                className=" border-[#1b1b1b]  border-[1px] w-full mt-[2vh] outline-none h-[5vh] rounded-xl focus:border-[#1b1b1b] max-w-2xl text-white p-5"
                placeholder="Confirm Password"
                onChange={(e) => {
                  return setconfirmpassword(e.target.value);
                }}
              />
            </div>

            <div className="mt-8  sm:p-5 flex justify-center flex-col gap-4">
              <button
                className="px-6 py-3 rounded-2xl border border-gray-600 hover:bg-[#111010] text-gray-300 font-bold"
                onClick={HandleSignupButtonClick}
              >
                Signup
              </button>
              <p className="font-bold p-2">
                Already Have an account?{" "}
                <Link
                  to={"/login"}
                  className="ml-1 font-bold hover:text-blue-400 text-blue-500"
                >
                  Login Here
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
