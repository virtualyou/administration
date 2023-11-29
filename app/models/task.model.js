
/*
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

const DataTypes = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    return sequelize.define("tasks", {
        name: {
            type: Sequelize.STRING
        },
        type: {
            type: Sequelize.STRING
        },
        priority: {
            type: Sequelize.STRING
        },
        due: {
            type: Sequelize.STRING
        },
        completed: {
            type: Sequelize.STRING
        },
        trigger: {
            type: Sequelize.STRING
        },
        note: {
            type: Sequelize.STRING
        },
        userKey: {
            type: Sequelize.INTEGER
        }
    });
};

/*
  Task.create({
    name: "Send Taxes",
    type: "Obligation",
    priority: "High",
    due: "04/15/2024",
    trigger: "Pending W-2",
    completed: "",
    note: "",
    userKey: 10
  });
*/