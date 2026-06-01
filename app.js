const express = require("express");

const app = express();
const port = process.env.PORT || 3001;

// Required for POST webhook payloads
app.use(express.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

// ==================================================
// WEBHOOK VERIFICATION
// ==================================================
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  console.log("Verification Request:", req.query);

  if (
    mode === "subscribe" &&
    token === VERIFY_TOKEN
  ) {
    console.log("Webhook Verified");
    return res.status(200).send(challenge);
  }

  console.log("Verification Failed");
  return res.sendStatus(403);
});

// ==================================================
// RECEIVE WHATSAPP EVENTS
// ==================================================
app.post("/webhook", (req, res) => {
  const body = req.body;

  // Verify that this is a WhatsApp event
  if (body.object === "whatsapp_business_account") {
    body.entry.forEach((entry) => {
      entry.changes.forEach((change) => {
        console.log("WhatsApp Event Data:", JSON.stringify(change.value, null, 2));
      });
    });

    // Return 200 to acknowledge receipt
    return res.status(200).send("EVENT_RECEIVED");
  } else {
    // Return 404 if the event is not from WhatsApp
    return res.sendStatus(404);
  }
});

// ==================================================
// OPTIONAL ROOT PAGE
// ==================================================
app.get("/", (req, res) => {
  res.send("WhatsApp Webhook Running");
});

const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;
