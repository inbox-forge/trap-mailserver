import { SMTPServer } from "smtp-server";
import { simpleParser } from "mailparser";
import dotenv from "dotenv";
import config from "./config";
dotenv.config();
const server = new SMTPServer({
  onAuth: (auth, session, callback) => {
    if (auth.username === "username" && auth.password === "password") {
      return callback(null, { user: 123 });
    }
    return callback(new Error("Invalid username or password"));
  },
  onData: async (stream, session, callback) => {
    let data = "";
    stream.on("data", (chunk) => {
      data += chunk;
    });

    stream.on("end", async () => {
      const emailData = JSON.parse(JSON.stringify(session.envelope));
      const parsedEmail = await simpleParser(data);
      emailData.data = parsedEmail;
      console.log(JSON.stringify(emailData, null, 2));
    });
    callback();
  },
});

server.listen(config.SMTP_SERVER_PORT, () => {
  console.log(`SMTP server started on port ${config.SMTP_SERVER_PORT}`);
});
