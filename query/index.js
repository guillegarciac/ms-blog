const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

// This function will process events that are received from the event bus service and update the posts object accordingly
const handleEvent = (type, data) => {
  if (type === "PostCreated") {
    const { id, title } = data;

    posts[id] = { id, title, comments: [] };
  }

  if (type === "CommentCreated") {
    const { id, content, postId, status } = data;

    const post = posts[postId];
    post.comments.push({ id, content, status });
  }

  if (type === "CommentUpdated") {
    const { id, status, postId, content } = data;

    const post = posts[postId];
    const comment = post.comments.find(comment => {
      return comment.id === id;
    });

    comment.status = status;
    comment.content = content;
  }
};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;

  handleEvent(type, data);

  res.send({});
});

// Listen for events from the event bus service on port 4005 and process them as they come in so that the query service can update its state accordingly. This will allow the query service to have the most up-to-date information about posts and comments.

app.listen(4002, async () => {
  console.log("Listening on 4002");

  const res = await axios.get("http://event-bus-srv:4005/events");

  // This loop will process all events that have been emitted so far and update the posts object accordingly so that the query service has the most up-to-date information about posts and comments when it starts up and listens for new events. This will ensure that the query service does not miss any events that have been emitted before it started up. 
  for (let event of res.data) {
    console.log("Processing event:", event.type);

    handleEvent(event.type, event.data);
  }
});

