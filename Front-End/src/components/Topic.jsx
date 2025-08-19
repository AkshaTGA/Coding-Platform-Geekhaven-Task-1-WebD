const Topic = ({ topic, setClickedTopic }) => {
  const title = topic.title;

  return (
    <div
      className="w-[80%] min-h-18 rounded-2xl items-center border-[#2d2d2d] border z-100  hover:bg-[#1c1c1c] flex bg-[#111111]"
      onClick={() => {
        setClickedTopic(topic);
      }}
    >
      <p className="md:text-xl text-sm font-bold p-5 truncate ">{title}</p>
    </div>
  );
};

export default Topic;
