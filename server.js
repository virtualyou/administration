const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const app = express();

require('dotenv').config();

app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(
    cookieSession({
      name: "virtualyou-session",
      keys: ["COOKIE_SECRET"], // should use as secret environment variable
      httpOnly: true,
      sameSite: 'strict'
    })
);

// database
const db = require("./app/models");
const Task = db.task;
/*
db.sequelize.sync({force: true}).then(() => {
        console.log('Drop and Recreate Db');
        initial();
});
*/
db.sequelize.sync();

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the VirtualYou Administration API." });
});

// routes
require("./app/routes/task.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 3005;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

/*
{
  "name": "Change Home Air Filters",
  "type": "Maintenance",
  "priority": "High",
  "due": "11/21/2023",
  "trigger": "",
  "completed": "11/22/2023",
  "note": "Every 6 months",
  "userKey": 10
}*/

function initial() {
  Task.create({
    name: "Change Air Filters",
    type: "Maintenance",
    priority: "Normal",
    due: new Date('2023-11-21'),
    trigger: "",
    completed: null,
    note: "",
    userKey: 10
  });

  Task.create({
    name: "Send Taxes",
    type: "Obligation",
    priority: "High",
    due: new Date('2023-11-21'),
    trigger: "Pending W-2",
    completed: null,
    note: "",
    userKey: 10
  });

  Task.create({
    name: "Take Antibiotic",
    type: "Health",
    priority: "High",
    due: null,
    trigger: "",
    completed: null,
    note: "",
    userKey: 10
  });
}
