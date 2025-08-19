import { useEffect, useState } from "react";
import SingleQuestion from "./SingleQuestion";
import { useNavigate } from "react-router-dom";

const Questions = ({
  topic,
  UserID,
  setsofar,
  setTotal,
  page = 1,
  limit = 10,
  completed,
  setcompleted,
  setIsLoadingQuestions,
  notify,
  bookmarklist,
  setbookmarklist,
}) => {
  const topicid = topic._id;
  const [QuestionList, setQuestionList] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const getQuestionList = async () => {
      setIsLoadingQuestions(true);
      try {
        const url = `http://localhost:3000/api/getQuestions/?topicid=${topicid}&page=${page}&limit=${limit}`;
        const res = await fetch(url, {
          method: "GET",
          credentials: "include",
          signal,
        });
        const list = await res.json();
        setTotal(list.totalQuestions);
        setsofar(list.SoFar);
        setQuestionList(list.questions);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(err.message);
          navigate("/login");
        }
      } finally {
        setIsLoadingQuestions(false);
      }
    };

    getQuestionList();

    return () => {
      controller.abort();
    };
  }, [topicid, limit, page]);

  return (
    <>
      <div className="text-white flex flex-col  ">
        <div className="flex flex-col gap-5">
          {QuestionList.map((question) => (
            <SingleQuestion
              key={question._id}
              UserID={UserID}
              id={question._id}
              question={question}
              completed={completed}
              setcompleted={setcompleted}
              setIsLoadingQuestions={setIsLoadingQuestions}
              notify={notify}
              bookmarklist={bookmarklist}
              setbookmarklist={setbookmarklist}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Questions;
