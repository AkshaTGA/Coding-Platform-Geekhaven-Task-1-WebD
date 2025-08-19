import React, { useEffect, useState } from "react";
import AfterLoginNavbar from "../components/AfterLoginNavbar";
import { isAuthenticated } from "../../utils/checkAuth";
import { useNavigate } from "react-router-dom";
import { getCompleted } from "../../utils/Completed";
import { getBookmark } from "../../utils/Bookmarks";
import { parse } from "tldts";

const Dashboard = () => {
  const [ques, setques] = useState(0);
  const [Questions, setQuestions] = useState(0);
  const [UserID, SetUserId] = useState("");
  const [Name, SetName] = useState("");
  const [Email, SetEmail] = useState("");
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);
  const [bookmarklist, setbookmarklist] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const hi = async () => {
      const res = await isAuthenticated();
      SetUserId(res.userID);
      SetName(res.Name);
      SetEmail(res.Email);
    };
    hi();
  }, []);

  function getDomainName(url) {
    const result = parse(url);
    const Name = result.domainWithoutSuffix;
    if (Name == "leetcode") {
      return "LeetCode";
    } else if (Name == "codeforces") {
      return "Code Forces";
    } else if (Name == "codingninjas") {
      return "Coding Ninjas";
    } else if (Name == "geeksforgeeks") {
      return "Geeks for Geeks";
    } else {
      return "";
    }
  }

  async function fetchquestion(id) {
    try {
      const res = await fetch(
        `http://localhost:3000/api/search/id?id=${encodeURIComponent(id)}`,
        { method: "GET", credentials: "include" }
      );
      const data = await res.json();
      return data?.question?.[0] || data?.question || null;
    } catch (err) {
      console.error("fetchquestion error:", err);
      return null;
    }
  }

  useEffect(() => {
    const loadUserLists = async () => {
      if (!UserID) return;
      try {
        const completedArray = await getCompleted(UserID);
        const completedCount = Array.isArray(completedArray)
          ? completedArray.length
          : Number(completedArray) || 0;
        setQuestions(completedCount);

        const bkmkId = await getBookmark(UserID);
        if (!Array.isArray(bkmkId) || bkmkId.length === 0) {
          setbookmarklist([]);
          return;
        }

        const promises = bkmkId.map((id) => fetchquestion(id));
        const results = await Promise.all(promises);
        setbookmarklist(results);
      } catch (err) {
        console.error("Error loading user lists:", err);
      }
    };

    loadUserLists();
  }, [UserID]);

  useEffect(() => {
    const checkauth = async () => {
      setIsLoadingAuth(true);
      try {
        const isAuth = await isAuthenticated();
        if (!isAuth.authenticated) {
          navigate("/login");
        }
      } catch (error) {
        console.error(error.message);
        navigate("/");
      } finally {
        setIsLoadingAuth(false);
      }
    };
    checkauth();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      let start = 0;
      const step = () => {
        start += 1;
        if (start <= Questions) {
          setques(start);
          requestAnimationFrame(step);
        }
      };
      requestAnimationFrame(step);
    }, 500);
  }, [Questions]);

  const bg = {
    Easy: "#033218",
    Medium: "#5b3910",
    Hard: "#460505",
  };

  return (
    <section className="min-h-screen my-12 md:my-0 flex flex-col items-center bg-black text-white relative px-4 md:px-8">
      <div className="absolute inset-0  bg-gradient-to-br from-gray-900 via-black to-gray-800 opacity-70" />

      <AfterLoginNavbar />

      {!isLoadingAuth && (
        <>
          <div className="relative mt-20 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-wide bg-clip-text">
              <span className="text-blue-500">D</span>ashboard
            </h1>
            <p className="mt-2 text-gray-400 text-base sm:text-lg">
              Your{" "}
              <span className="text-lg sm:text-xl text-blue-400 font-bold">
                coding
              </span>{" "}
              progress
            </p>
          </div>

          <div className="relative mt-12 w-full max-w-6xl">

            <div className="flex flex-col md:flex-row gap-6">

              <div className="flex-1 flex flex-col items-center gap-5 justify-center rounded-2xl bg-white/5 border border-gray-700 shadow-lg p-6 backdrop-blur-md">
                <h2 className="text-xl sm:text-2xl font-semibold mb-3">
                  User Info
                </h2>
                <div
                  className="p-5 w-full sm:w-auto rounded-xl"
                  style={{
                    boxShadow: "2px 20px 10px black,-2px -2px 10px #ffffff10",
                  }}
                >
                  <div className="text-blue-300 flex flex-col sm:flex-row sm:gap-2 text-base sm:text-xl mb-2">
                    <b>User ID:</b>
                    <p className="break-all">{UserID}</p>
                  </div>
                  <div className="text-blue-300 flex flex-col sm:flex-row sm:gap-2 text-base sm:text-xl mb-2">
                    <b>Name:</b>
                    <p>{Name}</p>
                  </div>
                  <div className="text-blue-300 flex flex-col sm:flex-row sm:gap-2 text-base sm:text-xl">
                    <b>Email:</b>
                    <p className="break-all">{Email}</p>
                  </div>
                </div>
              </div>

              <div
                className="flex-1 flex flex-col items-center justify-center rounded-2xl bg-white/5 border border-gray-700 shadow-lg p-6 backdrop-blur-md"
                style={{
                  boxShadow: "2px 20px 10px black,-2px -2px 10px #ffffff10",
                }}
              >
                <h2 className="text-xl sm:text-2xl font-semibold mb-3">
                  Progress
                </h2>
                <Progresscircle
                  target={Math.min(100, Math.round((Questions / 570) * 100))}
                />
                <div className="mt-3 text-lg sm:text-xl font-bold text-center">
                  Questions Solved:{" "}
                  <span className="text-2xl sm:text-3xl text-blue-400 font-bold">
                    {ques}/570
                  </span>
                </div>
              </div>
            </div>

            <div
              className="mt-6 flex flex-col rounded-2xl bg-white/5 border border-gray-700 shadow-lg p-4 sm:p-6 backdrop-blur-md h-fit"
              style={{
                boxShadow: "2px 20px 10px black,-2px -2px 10px #ffffff10",
              }}
            >
              <h2 className="text-xl sm:text-2xl text-center font-semibold mb-4">
                Bookmarked Questions
              </h2>
              <ul className="space-y-3 flex flex-col items-center overflow-y-auto customscrollbar pr-2">
                {bookmarklist.map((question) => (
                  <li
                    key={question._id || question.title}
                    className="p-3 px-5 w-full sm:w-[80%]  rounded-2xl flex flex-col items-center sm:flex-row sm:justify-between sm:items-center gap-2 bg-gray-800 hover:bg-gray-700 transition"
                    onClick={() => {
                      window.open(`${question.url}`, "_blank");
                    }}
                  >
                    <div>
                      <div className="font-bold text-sm sm:text-base">
                        {question.title}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-400">
                        {getDomainName(question.url)}
                      </div>
                    </div>
                    <div
                      className="px-3 py-1 font-bold rounded-2xl text-xs sm:text-sm md:text-base text-center"
                      style={{ backgroundColor: bg[question.difficulty] }}
                    >
                      {question.difficulty}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}

      {isLoadingAuth && <span className="loader z-1000"></span>}
    </section>
  );
};

function Progresscircle({ target }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      let start = 0;
      const step = () => {
        start += 1;
        if (start <= target) {
          setProgress(start);
          requestAnimationFrame(step);
        }
      };
      requestAnimationFrame(step);
    }, 500);
  }, [target]);

  return (
    <div
      className={`h-[10rem] w-[10rem] rounded-full flex justify-center items-center`}
      style={{
        background: `conic-gradient(#3b82f6 0 ${progress / 2}%,#a918ed ${
          progress / 1.1
        }% ${progress}%, #ffffff ${progress}% 100%)`,
      }}
    >
      <div className="h-[9rem]  w-[9rem] bg-[#000000] rounded-full flex-col flex items-center justify-center text-xl font-bold">
        <div className="text-[#ffffff]"> {progress}%</div>
      </div>
    </div>
  );
}

export default Dashboard;
