
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

const { authJwt } = require("../utility");
const controller = require("../controllers/task.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept"
        );
        next();
    });

    /*
     * ************************************************************************
     * ADMIN ONLY
     * ************************************************************************
     */
    // GET - all tasks
    app.get(
        "/administration/v1/tasks",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.getAllTasks
    );

    // GET - a task by id
    app.get(
        "/administration/v1/tasks/:id",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.getTask
    );

    // PUT - update a task by id
    app.put(
        "/administration/v1/tasks/:id",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.updateTask
    );

    // DELETE - a task by id
    app.delete(
        "/administration/v1/tasks/:id",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.deleteTask
    );

    // DELETE - all tasks
    app.delete(
        "/administration/v1/tasks",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.deleteAllTasks
    );

    /*
     * ************************************************************************
     * OWNER, AGENT, (MONITOR?) USER
     * ************************************************************************
     */

    // GET - all tasks for owner
    app.get(
        "/administration/v1/owner/tasks",
        [authJwt.verifyToken, authJwt.isOwnerOrAgentOrMonitor],
        controller.getAllTasksForOwner
    );

    // GET - task by id for owner only
    app.get(
        "/administration/v1/owner/tasks/:id",
        [authJwt.verifyToken, authJwt.isOwnerOrAgentOrMonitor],
        controller.getTaskForOwner
    );

    // POST - create a new Task for owner (owner or agent cognizant of userKey)
    app.post(
        "/administration/v1/owner/tasks",
        [authJwt.verifyToken, authJwt.isOwnerOrAgent],
        controller.createTaskForOwner
    );

    // PUT - update a task for owner only
    app.put(
        "/administration/v1/owner/tasks/:id",
        [authJwt.verifyToken, authJwt.isOwnerOrAgent],
        controller.updateTaskForOwner
    );

    // DELETE - delete a task by id for owner only
    app.delete(
        "/administration/v1/owner/tasks/:id",
        [authJwt.verifyToken, authJwt.isOwnerOrAgent],
        controller.deleteTaskForOwner
    );

    // DELETE - all tasks for owner only
    app.delete(
        "/administration/v1/owner/tasks",
        [authJwt.verifyToken, authJwt.isOwnerOrAgent],
        controller.deleteAllTasksForOwner
    );

};

