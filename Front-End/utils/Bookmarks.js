export const getBookmark = async (userID) => {
  const res = await fetch(
    `http://localhost:3000/api/v1/user/bookmarks?UserID=${userID}`,
    {
      method: "GET",
      credentials: "include",
    }
  );
  const data = await res.json();
  const array = Array.from(new Set(data.Bookmark));
  return array;
};

export const addToBookmark = async (userID, QuesID) => {
  const res = await fetch(`http://localhost:3000/api/v1/user/bookmarks`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      UserID: userID,
      QuesID: QuesID,
    }),
  });
  const data = await res.json();
  return data.Bookmark;
};

export const DeleteBookmark = async (userID, QuesID) => {
  const res = await fetch(
    `http://localhost:3000/api/v1/user/bookmarks/delete`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        UserID: userID,
        QuesID: QuesID,
      }),
    }
  );
  const data = await res.json();
  return data.Bookmark;
};
