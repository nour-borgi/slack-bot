/*
Main file 
 run it with the command : npm start
*/
const request = require("request-promise");
const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const fs = require("fs");
//files
const config = require("./config");
//server
const app = express();
//you can change the port
app.set("port", process.env.PORT || 3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// start server
app.listen(app.get("port"), function() {
  console.log("Node app is running on port", app.get("port"));
});

const sendMessage = function(user_channel, message) {
  const options = {
    method: "POST",
    url: "https://slack.com/api/chat.postMessage",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.user_token}`
    },
    body: JSON.stringify({ channel: user_channel, text: message })
  };
  let resend = false;
  request(    //fetch the history to check if the last message is the same or not , to not send the same message twice
    {
      method: "GET",
      url: `https://slack.com/api/conversations.history?channel=${user_channel}`,
      headers: {
        Authorization: `Bearer ${config.user_token}`
      }
    },
    function(error, response) {
      if (error) throw new Error(error);
      if (
        JSON.parse(response.body).messages &&
        JSON.parse(response.body).messages.length
      ) {
        resend = JSON.parse(response.body).messages[0].text === message;  
      }
    }
  ).then(() => {
    if (!resend) {          // if the message wasnt send before 
      request(options, function(error, response) {
        if (error) throw new Error(error);
        console.log(response.body);
      });
    }
  });
};
const sendButton = function(user_channel) {
  const options = {
    method: "POST",
    url: "https://slack.com/api/chat.postMessage",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.token}`
    },
    body: JSON.stringify({
      channel: user_channel,
      attachments: [
        {
          text: "Do you want to try blocks or buttons with url ?",
          fallback: "You are unable to choose",
          callback_id: "test",
          color: "#3AA3E3",
          attachment_type: "default",
          actions: [
            {
              name: "block",
              text: "Blocks",
              type: "button",
              value: "block"
            },
            {
              name: "url",
              text: "URL Button",
              type: "button",
              value: "url",
              url: "https://hexastack.com",
              confirm: {
                title: "Are you sure?",
                text: "You are going to be directed to another page",
                ok_text: "Yes",
                dismiss_text: "No, thanks"
              }
            }
          ]
        }
      ]
    })
  };
  request(options, function(error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
  });
};
const sendBlock = function(user_channel) {
  const options = {
    method: "POST",
    url: "https://slack.com/api/chat.postMessage",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.token}`
    },
    body: JSON.stringify({
      channel: user_channel,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "Danny Torrence left the following review for your property:"
          }
        },
        {
          type: "section",
          block_id: "section567",
          text: {
            type: "mrkdwn",
            text:
              "<https://example.com|Overlook Hotel> \n :star: \n Doors had too many axe holes, guest in room 237 was far too rowdy, whole place felt stuck in the 1920s."
          },
          accessory: {
            type: "image",
            image_url:
              "https://is5-ssl.mzstatic.com/image/thumb/Purple3/v4/d3/72/5c/d3725c8f-c642-5d69-1904-aa36e4297885/source/256x256bb.jpg",
            alt_text: "Haunted hotel image"
          }
        },
        {
          type: "section",
          block_id: "section789",
          fields: [
            {
              type: "mrkdwn",
              text: "*Average Rating*\n1.0"
            }
          ]
        },
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: "*Author:* T. M. Schwartz"
            }
          ]
        },
        {
          type: "divider"
        }
      ]
    })
  };
  request(options, function(error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
  });
};
const sendImage = function(user_channel) {
  const options = {
    method: "POST",
    url: "https://slack.com/api/chat.postMessage",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.token}`
    },
    body: JSON.stringify({
      channel: user_channel,
      blocks: [
        {
          type: "image",
          title: {
            type: "plain_text",
            text: "Beautiful",
            emoji: true
          },
          image_url:
            "https://image.shutterstock.com/image-photo/beautiful-water-drop-on-dandelion-260nw-789676552.jpg",
          alt_text: "image1"
        }
      ]
    })
  };
  request(options, function(error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
  });
};
const sendJoke = function(user_channel) {
  let options = {};
  const options1 = {
    method: "GET",
    url: "http://api.icndb.com/jokes/random",   //It can get a joke from this api 
    headers: {}
  };
  const options2 = {
    method: "GET",
    url: "http://api.yomomma.info",     //It can get a joke from here too 
    headers: {}
  };
  const rand = Math.floor(Math.random() * 2) + 1;   //Random choice
  if (rand === 1) {
    options = options1;
  } else if (rand === 2) {
    options = options2;
  }
  request(options, function(error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
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

  request(options, function(error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
  });
};
const uploadFile = function(user_channel) {  //upload a file from computer
  const path = ""; //add the path of file
  const options = {
    method: "POST",
    url: "https://slack.com/api/files.upload",
    headers: {
      Authorization: `Bearer ${config.token}`,
      "Content-Type": "multipart/form-data"
    },
    formData: {
      channels: user_channel,
      file: {
        value: fs.createReadStream(path),
        options: {
          filename: "File"
        }
      },
      initial_comment: "Upload File"
    }
  };
  request(options, function(error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
  });
};
const getFiles = function() {   //check the list of files
  // Call this if you want to get Files
  const options = {
    method: "GET",
    url: "https://slack.com/api/files.list",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${config.token}`
    }
  };
  request(options, function(error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
  });
};
const sendURLFile = function(user_channel) {
  //add and send a remote file without showing its contain when sending in the message page
  const id = Math.floor(Math.random() * 200) + 1;
  const addRemoteFile = {
    method: "POST",
    url: "https://slack.com/api/files.remote.add",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${config.token}`
    },
    form: {
      external_id: id,
      external_url: "http://techslides.com/demos/sample-videos/small.mp4", //URL of File
      title: "File"
    }
  };
  request(addRemoteFile, function(error, response) {
    //request to add the file
    if (error) throw new Error(error);
    console.log(response.body);
  }).then(() => {
    const sendRemoteFile = {
      method: "POST",
      url: "https://slack.com/api/files.remote.share",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${config.token}`
      },
      form: {
        channels: user_channel,
        external_id: id
      }
    };
    request(sendRemoteFile, function(error, response) {  //Send the file
      if (error) throw new Error(error);
      console.log(response.body);
    });
  });
};

app.post("/", function(request, response) {
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
        } else if (RegExp("@UUXNZP916", "g").test(event.text)) {
          sendJoke(event.channel);
        }
      }
    }
    const payload = request.body.payload;
    if (payload && JSON.parse(payload).type === "interactive_message") {  //respond to interactive components
      if (JSON.parse(payload).actions[0].name === "block") {
        response.send("Block");
        sendBlock(JSON.parse(payload).channel.id);
      }
    }
  } else {
    console.log("POST request not verified");  //request not verified (not from slack)
  }
});

app.get("/", function(request, response) {
  console.log(JSON.stringify(request.body));
  response.send("200 OK");
});
