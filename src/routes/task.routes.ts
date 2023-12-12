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

import {NextFunction, Request, Response} from "express";
import taskController from "../controllers/task.controller";
import authJwt from '../utility/authJwt';
import express from 'express';

const taskRouter = express();

taskRouter.use(function (_req: Request, res: Response, next: NextFunction) {
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, Content-Type, Accept"
    );
    next();
});

/*
 * ************************************************************************
 * WARNING: Admin only
 * ************************************************************************
 */
// GET - all tasks
taskRouter.get(
    "/administration/v1/tasks",
    [authJwt.verifyToken, authJwt.isAdmin],
    taskController.getAllTasks
);

// GET - a task by id
taskRouter.get(
    "/administration/v1/tasks/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    taskController.getTask
);

// PUT - update a task by id
taskRouter.put(
    "/administration/v1/tasks/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    taskController.updateTask
);

// DELETE - a task by id
taskRouter.delete(
    "/administration/v1/tasks/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    taskController.deleteTask
);

// DELETE - all tasks
taskRouter.delete(
    "/administration/v1/tasks",
    [authJwt.verifyToken, authJwt.isAdmin],
    taskController.deleteAllTasks
);

/*
 * ************************************************************************
 * Owner related
 * ************************************************************************
 */

// GET - all tasks for owner
taskRouter.get(
    "/administration/v1/owner/tasks",
    [authJwt.verifyToken, authJwt.isOwnerOrAgentOrMonitor],
    taskController.getAllTasksForOwner
);

// GET - task by id for owner only
taskRouter.get(
    "/administration/v1/owner/tasks/:id",
    [authJwt.verifyToken, authJwt.isOwnerOrAgentOrMonitor],
    taskController.getTaskForOwner
);

// POST - create a new Task for owner (owner or agent cognizant of userKey)
taskRouter.post(
    "/administration/v1/owner/tasks",
    [authJwt.verifyToken, authJwt.isOwnerOrAgent],
    taskController.createTaskForOwner
);

// PUT - update a task for owner only
taskRouter.put(
    "/administration/v1/owner/tasks/:id",
    [authJwt.verifyToken, authJwt.isOwnerOrAgent],
    taskController.updateTaskForOwner
);

// DELETE - delete a task by id for owner only
taskRouter.delete(
    "/administration/v1/owner/tasks/:id",
    [authJwt.verifyToken, authJwt.isOwnerOrAgent],
    taskController.deleteTaskForOwner
);

// DELETE - all tasks for owner only
taskRouter.delete(
    "/administration/v1/owner/tasks",
    [authJwt.verifyToken, authJwt.isOwnerOrAgent],
    taskController.deleteAllTasksForOwner
);

export default taskRouter;

