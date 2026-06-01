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
  console.log(
    "Webhook Event:",
    JSON.stringify(req.body, null, 2)
  );

  res.sendStatus(200);
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
