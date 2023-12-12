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
 * app.ts
 */

import express, {type Express} from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import db from "./models/index";
import taskRouter from "./routes/task.routes";
import cookieSession from "cookie-session";
import * as process from "process";

const initIndex = process.argv.indexOf("--init=true");
const init = initIndex !== -1;

const app: Express = express();

dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.use(
    cookieSession({
        name: "virtualyou-session",
        keys: ["COOKIE_SECRET"],
        httpOnly: true,
        sameSite: 'strict'
    })
);

app.use(function (_req, res, next) {
    res.setTimeout(120000, function () {
        console.log('Request has timed out.');
        res.send(408);
    });
    next();
});

app.get("/", (_req, res) => {
    res.send("Welcome to the VirtuaYou UserAuth API.");
});

// database
const Task = db.task;

if (init) {
    db.sequelize.sync({force: true}).then(() => {
        console.log("Drop and Resync Db");
        initial();
    });
} else {
    db.sequelize.sync();
}

// routes
app.use(taskRouter);

// create reference role objects
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

export default app;
