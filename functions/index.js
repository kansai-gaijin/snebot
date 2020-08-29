const functions = require("firebase-functions");

const line = require("@line/bot-sdk");
const express = require("express");
const fs = require("fs");
const path = require("path");
const cp = require("child_process");
var admin = require("firebase-admin");
const ngrok = require("ngrok");

const messages = require("./messages");

const config = {
  channelAccessToken:
    "hxW3gvhHh6VtQSPxeL9nIUcCKYvlLcKTns1ixXB/g1d0loLEGKgL2yiXHJlLd2KtQK9KIDYA/DMHjYvL717/Ivq4u39kcwlnbdLehSLQebHte4pRWlVmehlwkufrrqffrjkhzZKlBhY+inE+LA7uzQdB04t89/1O/w1cDnyilFU=",
  channelSecret: "816a812f69e2136941a9f38eacbabd46"
};

const client = new line.Client(config);

admin.initializeApp(functions.config().firebase);

let database = admin.database();

// base URL for webhook server
let baseURL = process.env.BASE_URL;

// create Express app
// about Express itself: https://expressjs.com/
const app = express();

// serve static and downloaded files
app.use("/static", express.static("static"));
app.use("/downloaded", express.static("downloaded"));
app.get("/callback", (req, res) =>
  res.end(`I'm listening. Please access with POST.`)
);

// webhook callback
app.post("/callback", line.middleware(config), (req, res) => {
  if (req.body.destination) {
    console.log("Destination User ID: " + req.body.destination);
  }

  // req.body.events should be an array of events
  if (!Array.isArray(req.body.events)) {
    return res.status(500).end();
  }

  // handle events separately
  Promise.all(req.body.events.map(handleEvent))
    .then(() => res.end())
    .catch(err => {
      console.error(err);
      res.status(500).end();
    });

  return res.status(200).json({ message: "success" });
});

// simple reply function
const replyText = (token, texts) => {
  texts = Array.isArray(texts) ? texts : [texts];
  return client.replyMessage(
    token,
    texts.map(text => ({ type: "text", text }))
  );
};

function handleUnknown(message, replyToken, source) {
  client.replyMessage(
    replyToken,
    messages.unknownMessage.map(message => message)
  );
}

// callback function to handle a single event
function handleEvent(event) {
  if (event.replyToken && event.replyToken.match(/^(.)\1*$/)) {
    return console.log("Test hook recieved: " + JSON.stringify(event.message));
  }
  const message = event.message;
  switch (event.type) {
    case "message":
      switch (message.type) {
        case "text":
          return handleText(message, event.replyToken, event.source);
        case "image":
          return handleUnknown(message, event.replyToken, event.source);
        case "video":
          return handleUnknown(message, event.replyToken, event.source);
        case "audio":
          return handleUnknown(message, event.replyToken, event.source);
        case "location":
          return handleUnknown(message, event.replyToken, event.source);
        case "sticker":
          return handleUnknown(message, event.replyToken, event.source);
        default:
          return handleUnknown(message, event.replyToken, event.source);
      }
    case "follow":
      //return handleUnknown(message, event.replyToken, event.source);
      return console.log("Followed!");
    case "unfollow":
      return console.log(`Unfollowed this bot: ${JSON.stringify(event)}`);

    case "join":
      return handleUnknown(message, event.replyToken, event.source);

    case "leave":
      return console.log(`Left: ${JSON.stringify(event)}`);

    case "postback": {
      const data = event.postback.data;
      return handlePostBack(data, event.replyToken, event.source);
    }
    case "beacon":
      return replyText(event.replyToken, `Got beacon: ${event.beacon.hwid}`);

    default:
      throw new Error(`Unknown event: ${JSON.stringify(event)}`);
  }
}

async function handlePostBack(data, replyToken, source) {
  let ref = database.ref("users").child(source.userId);

  switch (data) {
    case "外壁塗装についての相談":
      ref.update({ state: "message02", message01: data });
      break;
    case "屋根工事についての相談":
      ref.update({ state: "message02", message01: data });
      break;
    case "その他の相談":
      ref.update({ state: 0 });
      handleCall(replyToken, source);
      break;
    case "お見積もりを依頼したい":
      ref.update({ state: "message03", message02: data });
      break;
    case "無料診断を依頼したい":
      ref.update({ state: "message03", message02: data });
      break;
    case "電話で直接相談したい":
      ref.update({ state: 0 });
      handleCall(replyToken, source);
      break;
    default:
      ref.set({
        state: 0,
        lastAccess: new Date().getTime()
      });
  }

  return handleReserve("", replyToken, source);
}

async function handleText(message, replyToken, source) {
  let currentState = await getReservationState(source.userId);
  let ref = database.ref("users").child(source.userId);

  if (currentState) {
    switch (currentState) {
      case "message03":
        ref.update({
          state: "message04",
          message03: message.text
        });
        return handleReserve(message, replyToken, source);
      case "message04":
        ref.update({
          state: "message05",
          message04: message.text
        });
        return handleReserve(message, replyToken, source);
      case "message05":
        ref.update({
          state: "message06",
          message05: message.text
        });
        return handleReserve(message, replyToken, source);
      case "message06":
        ref.update({
          state: 0,
          message06: message.text
        });
        return handleSuccess(message, replyToken, source);
      default:
        return handleReserve(message, replyToken, source);
    }
  }

  console.log(`Echo message to ${replyToken}: ${message.text}`);
  return handleUnknown(message, replyToken);
}

async function handleReserve(message, replyToken, source) {
  let currentState = await getReservationState(source.userId);

  if (currentState) {
    switch (currentState) {
      case "message02": {
        return client.replyMessage(
          replyToken,
          messages.adviceTypeMessage.map(message => message)
        );
      }
      case "message03": {
        return client.replyMessage(
          replyToken,
          messages.inputSizeMessage.map(message => message)
        );
      }
      case "message04": {
        return client.replyMessage(
          replyToken,
          messages.inputYearsMessage.map(message => message)
        );
      }
      case "message05": {
        return client.replyMessage(
          replyToken,
          messages.inputNameMessage.map(message => message)
        );
      }
      case "message06": {
        return client.replyMessage(
          replyToken,
          messages.inputNumberMessage.map(message => message)
        );
      }
      default:
        return handleUnknown(message, replyToken, source);
    }
  }

  return handleUnknown(message, replyToken, source);
}

async function handleSuccess(message, replyToken, source) {
  let data = await getReservationData(source.userId);
  const reply = await client.replyMessage(
    replyToken,
    messages.resSuccess.map(message => message)
  );
  const fs = admin
    .firestore()
    .collection("reservations")
    .add({
      to: ["info@se-inc.jp"],
      bcc: ["manager@logicri.co.jp"],
      template: {
        name: "new-reservation",
        data: {
          message01: data.message01,
          message02: data.message02,
          message03: data.message03,
          message04: data.message04,
          message05: data.message05,
          message06: data.message06
        }
      }
    });
  return reply;
}

async function handleCall(replyToken, source) {
  return client.replyMessage(
    replyToken,
    messages.callMessage.map(message => message)
  );
}

async function getReservationState(userId) {
  let db = database.ref("users/" + userId);
  let response = await db.once("value");
  let userData = await response.val();
  let state = userData ? userData.state : false;
  return state ? state : false;
}

async function getReservationData(userId) {
  let db = database.ref("users/" + userId);
  let response = await db.once("value");
  let userData = await response.val();
  if (userData) {
    return userData;
  }
  return false;
}

exports.app = functions.https.onRequest(app);
