
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const csv = require("csv-parser");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let users = {};

// Load users from CSV file
fs.createReadStream("user_credentials.csv")
  .pipe(csv())
  .on("data", (row) => {
    users[row.username] = row.password;
  })
  .on("end", () => {
    console.log("CSV file successfully processed");
  });

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (users[username] && users[username] === password) {
    res.send("✅ Login successful!");
  } else {
    res.send("❌ Invalid credentials.");
  }
});

const listener = app.listen(process.env.PORT, () => {
  console.log("App is listening on port " + listener.address().port);
});
