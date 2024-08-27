const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

app.post("/events", async (req, res) => {
  const { type, data } = req.body;

  if (type === "CommentCreated") {
    const status = data.content.includes("orange") ? "rejected" : "approved";

   await axios.post("http://event-bus-srv:4005/events", {
      type: "CommentModerated",
      data: {
        id: data.id,
        content: data.content,
        postId: data.postId,
        status,
      },
    });
  }

  res.send({});
});

app.listen(4003, () => {
  console.log("Listening on 4003");
});

// In the moderation service, we will listen for CommentCreated events. When we receive one, we will check the content of the comment. If it contains the word "orange", we will reject it by emitting a CommentModerated event with status rejected. Otherwise, we will approve it by emitting a CommentModerated event with status approved. We will also include the id, content, and postId of the comment in the CommentModerated event. We will send the CommentModerated event to the event bus service.