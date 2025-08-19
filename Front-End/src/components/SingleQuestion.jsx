import { useCallback, useEffect, useState } from "react";
import { parse } from "tldts";
import { addToCompleted, DeleteCompleted } from "../../utils/Completed";
import { addToBookmark, DeleteBookmark } from "../../utils/Bookmarks";

const SingleQuestion = ({
  question,
  UserID,
  completed,
  setcompleted,
  notify,
  bookmarklist,
  setbookmarklist,
}) => {
  const [ischechecked, setischecked] = useState(false);
  const [isbookmarked, setisbookmarked] = useState(false);
  const title = question.title;
  const difficulty = question.difficulty;
  const url = question.url;

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

  const bg = {
    Easy: "#033218",
    Medium: "#5b3910",
    Hard: "#460505",
  };

  useEffect(() => {
    if (completed?.includes(question._id)) {
      setischecked(true);
    } else {
      setischecked(false);
    }
  }, [completed, question._id]);

  useEffect(() => {
    if (bookmarklist?.includes(question._id)) {
      setisbookmarked(true);
    } else {
      setisbookmarked(false);
    }
  }, [bookmarklist, question._id]);

  const checktracker = async (e) => {
    const checked = e.target.checked;
    setischecked(checked);

    if (checked) {
      try {
        const array = await addToCompleted(UserID, question._id);
        setcompleted(array);
        notify("Quesion Checked", "sucess", 1000, "bottom-center", true);
      } catch (err) {
        console.error(err);
      } 
    } else {
      try {
        const array = await DeleteCompleted(UserID, question._id);
        setcompleted(array);
        notify("Question unchecked", "warn", 1000, "bottom-center", true);
      } catch (err) {
        console.error(err);
      } 
    }
  };
  const bookmarktracker = useCallback(
    async (nextState) => {
      if (nextState) {
        try {
          const array = await addToBookmark(UserID, question._id);
          setbookmarklist(array);
          notify(
            "Question added to Bookmarks",
            "sucess",
            1000,
            "bottom-center",
            true
          );
        } catch (err) {
          console.log("bookmark adding error");
          console.error(err);
        }
      } else {
        try {
          const array = await DeleteBookmark(UserID, question._id);
          setbookmarklist(array);
          notify(
            "Question removed from Bookmarks",
            "warn",
            1000,
            "bottom-center",
            true
          );
        } catch (err) {
          console.error(err);
        } 
      }
    },
    [UserID, notify, question._id, setbookmarklist]
  );

  const handleBookmarkClick = () => {
    setisbookmarked((prev) => {
      const next = !prev;
      bookmarktracker(next); 
      return next;
    });
  };
  return (
    <div
      className={`min-h-18 z-1000 rounded-2xl w-full p-2 flex flex-col md:flex-row 
    border border-[#2d2d2d] justify-between gap-4 cursor-pointer 
    ${ischechecked ? "bg-[#02720b]" : "bg-[#111111]"} 
    ${ischechecked ? "hover:bg-[#376c30]" : "hover:bg-[#1f1f1f]"}
  `}
    >
      <div className="flex flex-col gap-2 w-full md:w-auto">
        <div className="flex items-center gap-4">
          <input
            type="checkbox"
            className="z-1000"
            checked={ischechecked}
            onChange={(e) => {
              e.stopPropagation();
              checktracker(e);
            }}
          />

          <svg
            height="20"
            width="20"
            viewBox="0 0 47.94 47.94"
            xmlns="http://www.w3.org/2000/svg"
            className={`cursor-pointer hover:fill-amber-100 ${isbookmarked?"fill-yellow-300":"fill-white"} `}
            onClick={(e)=>{ e.stopPropagation(); handleBookmarkClick(); }}
          >
            <path
              d="M26.285,2.486l5.407,10.956c0.376,0.762,1.103,1.29,1.944,1.412l12.091,1.757
            c2.118,0.308,2.963,2.91,1.431,4.403l-8.749,8.528c-0.608,0.593-0.886,1.448-0.742,2.285l2.065,12.042
            c0.362,2.109-1.852,3.717-3.746,2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403,0l-10.814,5.685
            c-1.894,0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528
            c-1.532-1.494-0.687-4.096,1.431-4.403l12.091-1.757c0.841-0.122,1.568-0.65,1.944-1.412l5.407-10.956
            C22.602,0.567,25.338,0.567,26.285,2.486z"
            />
          </svg>
        </div>

        <div
          onClick={() => window.open(url, "_blank")}
          className="cursor-pointer"
        >
          <div className=" md:text-2xl text-sm font-bold mb-1">{title}</div>
          <div className="truncate text-sm md:text-base">
            <b>Platform: </b>
            {getDomainName(url)}
          </div>
        </div>
      </div>

      <div className="self-start md:self-center">
        <p
          className="p-2 px-3 font-bold rounded-2xl text-sm md:text-base"
          style={{ backgroundColor: bg[difficulty] }}
        >
          {difficulty}
        </p>
      </div>
    </div>
  );
};

export default SingleQuestion;
