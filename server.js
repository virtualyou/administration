
/*
 *
 * VirtualYou Project
 * Copyright 2023 David L Whitehurst
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const init = process.argv.includes('--init=true');

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
      keys: ["COOKIE_SECRET"],
      domain: '.virtualyou.info',
      httpOnly: true,
      sameSite: 'strict'
    })
);

// CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// database
const db = require("./app/models");
const Task = db.task;

if (init) {
  db.sequelize.sync({force: true}).then(() => {
    console.log('Drop and Resync Db');
    initial();
  });
} else {
  db.sequelize.sync();
}

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
    due: "2023-11-21",
    trigger: "",
    completed: null,
    note: "",
    userKey: 10
  });

  Task.create({
    name: "Send Taxes",
    type: "Obligation",
    priority: "High",
    due: "2023-11-21",
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
