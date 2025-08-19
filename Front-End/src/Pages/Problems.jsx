import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Topic from "../components/Topic";
import Questions from "../components/Questions";
import { motion } from "framer-motion";
import AfterLoginNavbar from "../components/AfterLoginNavbar";
import { isAuthenticated } from "../../utils/checkAuth";
import { useNavigate } from "react-router-dom";
import { getCompleted } from "../../utils/Completed";
import { notify } from "../../utils/toastmessage";
import { ToastContainer } from "react-toastify";
import { getBookmark } from "../../utils/Bookmarks";

const Problems = () => {
  const [topics, setTopics] = useState([]);
  const [clickedTopic, setClickedTopic] = useState({
    title: "Learn the basics",
    _id: "689fa0e7b7f87e2cc60ff4c3",
  });

  const [isLoadingTopics, setIsLoadingTopics] = useState(false);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);

  const [topicPage, setTopicPage] = useState(1);
  const [topicSofar, setTopicSofar] = useState(0);
  const [topicTotal, setTopicTotal] = useState(0);
  const [topicLimit, setTopicLimit] = useState(10);

  const [page, setPage] = useState(1);
  const [sofar, setSofar] = useState(0);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(10);
  const [UserID, SetUserId] = useState("");
  const [completed, setcompleted] = useState([]);
  const [bookmarklist, setbookmarklist] = useState([]);
  const [UserName, setUserName] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetch_Topics = async () => {
      setIsLoadingTopics(true);
      try {
        const response = await fetch(
          `http://localhost:3000/api/categories?page=${topicPage}&limit=${topicLimit}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await response.json();
        setTopics(data.categories);
        setTopicTotal(data.total);
        setTopicSofar(data.soFar);
      } catch (err) {
        navigate("/login");

        console.error("Something went wrong: " + err.message);
      } finally {
        setIsLoadingTopics(false);
      }
    };

    fetch_Topics();
  }, [topicPage, topicLimit]);

  const nextTopicPage = () => setTopicPage((prev) => prev + 1);
  const prevTopicPage = () => setTopicPage((prev) => prev - 1);
  const topicLimitChange = (e) => {
    setTopicLimit(Number(e.target.value));
    setTopicPage(1);
  };

  const nextpage = () => setPage((prev) => prev + 1);
  const prevpage = () => setPage((prev) => prev - 1);
  const limitChange = (e) => {
    setLimit(Number(e.target.value));
    setPage(1);
  };

  useEffect(() => {
    const checkauth = async () => {
      setIsLoadingAuth(true);
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
        setIsLoadingAuth(false);
      }
    };
    checkauth();
  }, []);

  useEffect(() => {
    const hi = async () => {
      const res = await isAuthenticated();
      SetUserId(res.userID);
      setUserName(res.Name);
    };
    hi();
  }, []);

  useEffect(() => {
    const loadLists = async () => {
      if (!UserID) return;
      try {
        const completedArray = await getCompleted(UserID);
        setcompleted(completedArray || []);
        const bk = await getBookmark(UserID);
        setbookmarklist(bk || []);
      } catch (err) {
        console.error(err);
      }
    };

    loadLists();
  }, [UserID]);

  useEffect(() => {
    console.log(bookmarklist);
  }, [bookmarklist]);

  return (
    <div className="mt-10 md:mt-0">
      <ToastContainer />

      {!isLoadingAuth && !isLoadingQuestions && !isLoadingTopics && (
        <section className="min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black text-white relative">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-700 via-black to-gray-800 opacity-50" />
          <AfterLoginNavbar />
          <p className="z-100 mt-40 sm:mt-28 text-center text-lg sm:text-2xl font-semibold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Hello {UserName}! 
          </p>
          <p className="z-100 text-center text-lg sm:text-2xl font-semibold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">the Arena is ready — time to level up your skills ⚡</p>
          <div className=" text-4xl mt-2 font-bold z-100">
            <span className="text-blue-400">P</span>roblem Set
          </div>

          <div
            className="z-100 flex flex-col mt-10 md:mt-20 md:flex-row gap-6 md:gap-10 w-full
              p-2"
          >
            {!isLoadingTopics && (
              <div className="flex flex-col shrink w-full md:w-1/2 customscrollbar overflow-y-auto max-h-[80vh] border-2 rounded-2xl border-[#3a3a3a] items-center gap-6 py-5 px-2">
                <h2 className="text-2xl md:text-3xl font-bold">Topics</h2>

                <div className="flex justify-between w-full px-2 md:px-4 font-bold text-sm md:text-base">
                  <button
                    className="cursor-pointer disabled:text-gray-500"
                    disabled={topicPage === 1}
                    onClick={prevTopicPage}
                  >
                    Previous
                  </button>
                  <select
                    className="bg-black rounded-3xl px-2 py-1"
                    onChange={topicLimitChange}
                    value={topicLimit}
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                  </select>
                  <button
                    className="cursor-pointer disabled:text-gray-500"
                    disabled={topicTotal === topicSofar}
                    onClick={nextTopicPage}
                  >
                    Next
                  </button>
                </div>

                {topics.map((topic) => (
                  <Topic
                    key={topic._id || topic.title}
                    setClickedTopic={setClickedTopic}
                    topic={topic}
                  />
                ))}
              </div>
            )}
            {!isLoadingQuestions && (
              <>
                <div className="flex flex-col shrink w-full md:w-1/2 customscrollbar overflow-y-auto max-h-[80vh] border-2 rounded-2xl p-4 border-[#3a3a3a] items-center">
                  <h2 className="m-2 text-lg md:text-xl font-bold p-2 rounded-xl border-[#525252] border text-center">
                    Topic: {clickedTopic.title}
                  </h2>

                  <h1 className="text-center text-2xl md:text-3xl font-bold">
                    Questions-({total})
                  </h1>

                  <div className="flex justify-between w-full my-2 px-2 md:px-4 font-bold text-sm md:text-base">
                    <button
                      className="cursor-pointer disabled:text-gray-500"
                      disabled={page === 1}
                      onClick={prevpage}
                    >
                      Previous
                    </button>
                    <select
                      onChange={limitChange}
                      className="bg-black rounded-xl px-2 py-1"
                      value={limit}
                    >
                      <option value="10">10</option>
                      <option value="20">20</option>
                      <option value="30">30</option>
                      <option value="40">40</option>
                      <option value="50">50</option>
                    </select>
                    <button
                      className="cursor-pointer disabled:text-gray-500"
                      disabled={total === sofar}
                      onClick={nextpage}
                    >
                      Next
                    </button>
                  </div>

                  <Questions
                    topic={clickedTopic}
                    setTotal={setTotal}
                    limit={limit}
                    setsofar={setSofar}
                    page={page}
                    UserID={UserID}
                    completed={completed}
                    setcompleted={setcompleted}
                    setIsLoadingQuestions={setIsLoadingQuestions}
                    notify={notify}
                    bookmarklist={bookmarklist}
                    setbookmarklist={setbookmarklist}
                  />
                </div>
              </>
            )}
            {isLoadingQuestions && (
              <div className="flex flex-col justify-center items-center shrink w-full md:w-1/2 customscrollbar overflow-y-auto max-h-[80vh] border-2 rounded-2xl p-4 border-[#3a3a3a]">
                <span className="loader z-1000 "></span>
              </div>
            )}
          </div>
        </section>
      )}

      {isLoadingAuth ||
        isLoadingQuestions ||
        (isLoadingTopics && (
          <section className="min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black text-white relative">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-700 via-black to-gray-800 opacity-50" />
            <AfterLoginNavbar />
            <span className="loader z-1000 "></span>
          </section>
        ))}
    </div>
  );
};

export default Problems;
