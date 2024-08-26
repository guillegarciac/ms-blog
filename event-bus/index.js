const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const e = require("express");

const app = express();
app.use(bodyParser.json());

const events = [];

app.post("/events", (req, res) => {
  const event = req.body;

  events.push(event); 

  // Posts service
  axios.post("http://posts-clusterip-srv:4000/events", event).catch((err) => {
    console.log(err.message);
  });

  // Comments service
  /* axios.post("http://localhost:4001/events", event).catch((err) => {
    console.log(err.message);
  }); */

  // Query service
  /* axios.post("http://localhost:4002/events", event).catch((err) => {
    console.log(err.message);
  }); */

  // Moderation service
  /* axios.post("http://localhost:4003/events", event).catch((err) => {
    console.log(err.message);
  }) */;

  res.send({ status: "OK" });
});

app.get("/events", (req, res) => {
  res.send(events);
});

app.listen(4005, () => {
  console.log("Listening on 4005");
});