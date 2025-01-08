const { Client, LocalAuth } = require("whatsapp-web.js");
const words = require("./listword");
const qrcode = require("qrcode-terminal");

const client = new Client({
  authStrategy: new LocalAuth(),
});

let status = ""; // Variable to store the custom status

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
  console.log("QR Code scanned!");
});

client.on("ready", () => {
  console.log("Bot is ready!");
});

client.on("message", (msg) => {
  const message = msg.body.toLowerCase();
  const sender = msg.from;

  // Check if the message is !status or !nostatus
  if (message.startsWith("!status")) {
    const newStatus = message.slice(8).trim(); // Get status after !status
    if (newStatus) {
      status = newStatus;
      client.sendMessage(sender, `Status updated to: "${status}"`);
    } else {
      client.sendMessage(sender, "Please provide a status after !status.");
    }
  } else if (message === "!nostatus") {
    status = ""; // Reset status to default
    client.sendMessage(sender, "Custom status disabled. Returning to default replies.");
  } else {
    // Check if the message matches any word in listword.js
    const isMatch = words.some((word) => message.includes(word.toLowerCase()));

    if (isMatch) {
      const currentHour = new Date().getHours(); // Get the current hour (24-hour format)

      let reply = "";

      if (status) {
        reply = status; // Send custom status if available
      } else if (currentHour >= 6 && currentHour < 15) {
        reply = "Lutpi lagi di sekolah 🚍";
      } else if (currentHour >= 15 && currentHour < 24) {
        reply = "iyaa?";
      } else if (currentHour >= 0 && currentHour < 6) {
        reply = "lutpi masih bobo 😴";
      }

      // Reply to the sender
      client.sendMessage(sender, reply);
    }
  }
});

client.initialize();
