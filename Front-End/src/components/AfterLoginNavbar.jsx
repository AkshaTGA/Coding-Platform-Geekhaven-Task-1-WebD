import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useEffect, useRef, useState } from "react";
import SingleQuestion from "./SingleQuestion";
import { isAuthenticated } from "../../utils/checkAuth";
import { getBookmark } from "../../utils/Bookmarks";
import { getCompleted } from "../../utils/Completed";
import { notify } from "../../utils/toastmessage";

const noop = () => {};

const AfterLoginNavbar = () => {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [active, setActive] = useState(false);
  const [userID, setUserID] = useState(null);
  const [bookmarklist, setBookmarklist] = useState([]);
  const [completedList, setCompletedList] = useState([]);
  const [totalresults, settotalresults] = useState(0);
    const [Name, SetName] = useState("");


  const inputRef = useRef(null);

  const handleLogout = () => {
    Cookies.remove("uid");
    notify("Logged out Successfully!","sucess",1000)
    setTimeout(()=>{
       navigate("/login");
    },1000)
   
  };

  useEffect(() => {
    if (!active) return;
    if (!query || query.trim() === "") {
      setResults([]);
      setLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;
    const timer = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const url = `http://localhost:3000/api/search?q=${encodeURIComponent(
          query
        )}`;
        const res = await fetch(url, {
          method: "GET",
          credentials: "include",
          signal,
        });

        if (res.status === 401) {
          navigate("/login");
          return;
        }

        if (!res.ok) throw new Error(`Search failed: ${res.status}`);

        const data = await res.json();
        const list = data.questions;
        settotalresults(list.length);
        setResults(list);
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error(err);
        setError(err.message || "Search error");
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => {
      query == "" ? settotalresults(0) : null;

      clearTimeout(timer);
      controller.abort();
    };
  }, [query, active]);






useEffect(()=>{
  const hi=async ()=>{

    const details=await isAuthenticated();
    const Name=details.Name
    SetName(Name)
  }
  hi()
},[])



  useEffect(() => {
    let mounted = true;
    const loadUserData = async () => {
      try {
        const auth = await isAuthenticated();
        if (!mounted) return;
        const id = auth?.userID || null;

        setUserID(id);
        if (id) {
          const bm = await getBookmark(id);
          const comp = await getCompleted(id);
          if (!mounted) return;
          setBookmarklist(bm);
          setCompletedList(comp);
        }
      } catch (err) {
        console.error("failed to load user data for search overlay", err);
      }
    };

    if (active) loadUserData();

    return () => {
      mounted = false;
    };
  }, [active]);

  const renderResult = (item) => (
    <div
      key={item._id}
      className="p-3 bg-[#071024] border border-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onMouseDown={(e) => e.preventDefault()}
      onClick={(e) => {
        const tools = e.target.closest("input, button,svg,div");
        if (tools) return;
        setActive(false);
      }}
    >
      <SingleQuestion
        question={item}
        UserID={userID}
        setIsLoadingQuestions={noop}
        completed={completedList}
        setcompleted={setCompletedList}
        notify={notify}
        bookmarklist={bookmarklist}
        setbookmarklist={setBookmarklist}
      />
    </div>
  );

  return (
    <>
      <nav
        className="w-full flex flex-wrap items-center justify-between gap-3 px-4 md:px-10 py-3 fixed top-0 left-0 z-[10000] 
    bg-gradient-to-r from-[#08121b]/80 via-[#071229]/70 to-[#081229]/80 backdrop-blur-xl border-b border-gray-800 shadow-md"
      >
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="w-10 h-10 rounded-md bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
            GH
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-white font-extrabold text-lg">GEEKHAVEN</span>
            <span className="text-xs text-gray-400 -mt-1">
              Practice • Learn • Improve
            </span>
          </div>
        </div>

        <div className="flex-1 w-full sm:w-auto max-w-2xl px-0 sm:px-4 order-3 sm:order-2">
          <div className="relative w-full">
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setActive(true)}
              type="text"
              className="w-full px-4 py-2 rounded-xl border border-gray-700 bg-[#041024] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Search questions by title..."
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></div>
          </div>
        </div>
    
        <div className="flex flex-col sm:flex-row items-center justify-end gap-2 sm:gap-4 order-2 sm:order-3 w-full sm:w-auto">
  <p className="bg-clip-text bg-gradient-to-r text-transparent text-base sm:text-lg md:text-xl from-blue-400 via-pink-400 to-purple-500 font-semibold truncate max-w-[200px] sm:max-w-none text-center sm:text-left">
    Welcome {Name}
  </p>

  <div className="flex flex-wrap justify-center sm:justify-end gap-2">
    <button
      onClick={() => navigate("/")}
      className="px-3 py-2 rounded-lg text-sm text-gray-200 hover:bg-gray-800/60 transition"
    >
      Home
    </button>
    <button
      onClick={() => navigate("/problems")}
      className="px-3 py-2 rounded-lg text-sm text-gray-200 hover:bg-gray-800/60 transition"
    >
      Problems
    </button>
    <button
      onClick={() => navigate("/dashboard")}
      className="px-3 py-2 rounded-lg text-sm text-gray-200 hover:bg-gray-800/60 transition"
    >
      Dashboard
    </button>
    <button
      onClick={handleLogout}
      className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm"
    >
      Logout
    </button>
  </div>
</div>

      </nav>

      {active && (
        <div className="fixed mt-12 sm:mt-0 inset-0 z-[9998]">
          <div
            className="absolute inset-0 customscrollbar bg-black/60 backdrop-blur-sm"
            onMouseDown={() => setActive(false)}
          />
          <div className="absolute left-0 right-0 top-20 mx-auto max-w-4xl px-4">
            <div className="bg-transparent">
              <div className="bg-[#0b1220]/90 border border-gray-800 rounded-2xl p-3 max-h-[60vh] overflow-auto">
                {query.length !== 0 && !loading && (
                  <p>Total Results: {totalresults}</p>
                )}
                {loading && (
                  <div className="text-gray-300 p-2">Searching...</div>
                )}
                {error && <div className="text-red-400 p-2">{error}</div>}
                {!loading && results.length === 0 && query.length !== 0 && (
                  <div className="text-gray-400 p-2">No matching questions</div>
                )}
                {!loading && query.length === 0 && (
                  <div className="text-gray-400 p-2">
                    Type a question to see results
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  {results.map((result) => renderResult(result))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AfterLoginNavbar;
