export const getCompleted = async (userID) => {
  const res = await fetch(
    `http://localhost:3000/api/v1/user/completed/?UserID=${userID}`,
    {
      method: "GET",
      credentials: "include",
    }
  );
  const data = await res.json();
  console.log(userID, data);
  return data.Completed;
};

export const addToCompleted = async (userID, QuesID) => {
  const res = await fetch(`http://localhost:3000/api/v1/user/completed`, {
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
  return data.Completed;
};

export const DeleteCompleted = async (userID, QuesID) => {
  const res = await fetch(
    `http://localhost:3000/api/v1/user/completed/delete`,
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
  return data.Completed;
};
