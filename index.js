/*
Main file 
 run it with the command : npm start
*/
const request = require("request-promise");
const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const { sendApiRequest } = require('./sendRequest');
const bodyRequest = require('./bodyRequest')
//files
const config = require("./config");
//server
const app = express();
//you can change the port
app.set("port", process.env.PORT || 3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// start server
app.listen(app.get("port"), function () {
  console.log("Node app is running on port", app.get("port"));
});
//options of requests : 
const options = function (method, user, url, contentType, body, form, formData) {
  let token;
  (user === "nothing") ? token = "" : (user) ? token = config.user_token : token = config.token; //two types of tokens 
  return {
    method: method,
    url: url,
    headers: {
      "Content-Type": contentType,
      Authorization: `Bearer ${token}`
    },
    body,
    form,
    formData
  }
}
const sendMessage = function (user_channel, message) {
  let resend = false;
  //fetch the history to check if the last message is the same or not , to not send the same message twice
  sendApiRequest(options("GET", true, `https://slack.com/api/conversations.history?channel=${user_channel}`))
    .then(() => {
      if (!resend) {          // if the message wasnt send before 
        sendApiRequest(options("POST", true, "https://slack.com/api/chat.postMessage", "application/json", bodyRequest.simpleMessage(user_channel, message)));
      }
    });
};

const sendButton = function (user_channel) {
  sendApiRequest(options("POST", true, "https://slack.com/api/chat.postMessage", "application/json", bodyRequest.button(user_channel)));
};

const sendBlock = function (user_channel) {
  sendApiRequest(options("POST", true, "https://slack.com/api/chat.postMessage", "application/json", bodyRequest.block(user_channel)));
};

const sendImage = function (user_channel) {
  sendApiRequest(options("POST", true, "https://slack.com/api/chat.postMessage", "application/json", bodyRequest.image(user_channel)));
};

const sendJoke = function (user_channel) {
  let url = "";
  const rand = Math.floor(Math.random() * 2) + 1;   //Random choice
  if (rand === 1) {
    url = "http://api.icndb.com/jokes/random";
  } else if (rand === 2) {
    url = "http://api.yomomma.info";
  }
  request(options("GET", "nothing", url), function (error, response) {
    if (error) throw new Error(error);
    if (rand == 1) {
      sendMessage(
        user_channel,
        "You called me so here is a joke : " +
        JSON.parse(response.body).value.joke
      );
    } else {
      sendMessage(
        user_channel,
        "You called me so here is a joke : " + JSON.parse(response.body).joke
      );
    }
  });
};

const uploadFile = function (user_channel) {  //upload a file from computer
  const path = "D:/Nour Borgi/RT3/Web/TP1.pdf"; //add the path of file
  sendApiRequest(options("POST", false, "https://slack.com/api/files.upload", "multipart/form-data", {}, {}, bodyRequest.file(user_channel, path)));
};

const getFiles = function () {   //check the list of files
  // Call this if you want to get Files
  sendApiRequest(options("GET", false, "https://slack.com/api/files.list", "application/x-www-form-urlencoded"));
};
const sendURLFile = function (user_channel) {
  //add and send a remote file without showing its contain when sending in the message page
  const id = Math.floor(Math.random() * 200) + 1;
  let form = {
    external_id: id,
    external_url: "http://techslides.com/demos/sample-videos/small.mp4", //URL of File
    title: "File"
  }
  sendApiRequest(options("POST", false, "https://slack.com/api/files.remote.add", "application/x-www-form-urlencoded", {}, form))
    .then(() => {           //false because user token not allowed 
      let form = {
        channels: user_channel,
        external_id: id
      };
      sendApiRequest(options("POST", false, "https://slack.com/api/files.remote.share", "application/x-www-form-urlencoded", {}, form));
    });
};

app.post("/", function (request, response) {
  console.log(request.body);
  // Verification of the request :
  const timestamp = request.headers["x-slack-request-timestamp"];
  const sig_basestring = "v0:" + timestamp + ":" + JSON.stringify(request.body);
  const slack_signature = request.headers["x-slack-signature"];
  const hmac =
    "v0=" +
    crypto
      .createHmac("sha256", config.siging_secret)
      .update(sig_basestring)
      .digest("hex");
  if (crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(slack_signature))) {
    //the request origin is validate
    response.status(200);
    response.send({ challenge: request.body.challenge });
    let event = request.body.event;
    if (event && event.subtype != "bot_message") {  //respond to events
      if (event.type === "app_home_opened") {
        const welcomeMessage =
          "Welcome to Botti ! I m Nour s Bot :p \nTo try buttons write : B or button\n To try image write : image";
        sendMessage(event.channel, welcomeMessage);
      } else if (event.type === "message") {
        if (event.text === "hi" || event.text === "hello") {
          sendMessage(event.channel, "Hi =)");
        } else if (
          event.text === "buttons" ||
          event.text === "button" ||
          event.text === "B"
        ) {
          sendButton(event.channel);
        } else if (event.text === "image" || event.text === "i") {
          sendImage(event.channel);
          // sendURLFile(event.channel);
          // uploadFile(event.channel);
        } else if (RegExp("@UUXNZP916", "g").test(event.text)) {
          sendJoke(event.channel);
        }
      }
    }
  } else {
    console.log("POST request not verified");  //request not verified (not from slack)
  }
  const payload = request.body.payload;
  if (payload && JSON.parse(payload).type === "interactive_message") {  //respond to interactive components
    if (JSON.parse(payload).actions[0].name === "block") {
      response.send("Block");
      sendBlock(JSON.parse(payload).channel.id);
    }
  }
});

app.get("/", function (request, response) {
  console.log(JSON.stringify(request.body));
  response.send("200 OK");
});
