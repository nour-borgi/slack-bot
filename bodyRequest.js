const fs = require("fs");


module.exports = {
    simpleMessage(user_channel, message) {
        return JSON.stringify({ channel: user_channel, text: message });
    },
    button(user_channel) {
        return JSON.stringify({
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
    },
    block(user_channel) {
        return JSON.stringify({
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
        });
    },
    image(user_channel){
        return JSON.stringify({
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
    },
    file(user_channel,path){
        return {
            channels: user_channel,
            file: {
              value: fs.createReadStream(path),
              options: {
                filename: "File"
              }
            },
            initial_comment: "Upload File"
          }
    }
};