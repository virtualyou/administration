
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
 * task.controller.ts
 */

import { Request, Response } from 'express';
import db from '../models';
const Task = db.task;

class ExpressError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ExpressError';
    }
}

const errorHandler = (err: ExpressError, _req: Request, res: Response) => {
    console.error(err.stack);
    res.status(500).send('Internal server error');
};

const getAllTasks = (_req: Request, res: Response) => {
    Task.findAll()
        .then((data: TaskType) => {
            res.send(data);
        })
        .catch((err: ExpressError) => {
            errorHandler(err, _req, res);
        });
};

const getAllTasksForOwner = (req: Request, res: Response) => {

    Task.findAll({
            where: {
                userKey: getWhereKey(req),
            },
        }
    )
        .then((data: TaskType) => {
            res.send(data);
        })
        .catch((err: ExpressError) => {
            errorHandler(err, req, res);
        });
};

const getTask = (req: Request, res: Response) => {
    const id = req.params['id'];

    Task.findByPk(id)
        .then((data: TaskType) => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find Task with id=${id}.`
                });
            }
        })
        .catch((err: ExpressError) => {
            errorHandler(err, req, res);
        });
};

const getTaskForOwner = (req: Request, res: Response) => {
    const id = req.params['id'];

    Task.findOne({
        where: {
            id: id,
            userKey: getWhereKey(req)
        }
    })
        .then((data: TaskType) => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `May not belong to Owner or cannot find this Task with id=${id}.`
                });
            }
        })
        .catch((err: ExpressError) => {
            errorHandler(err, req, res);
        });
};

const createTaskForOwner = (req: Request, res: Response) => {

    // Check request
    if (!req.body.name) {
        res.status(400).send({
            message: "Bad Request, name cannot be empty!"
        });
        return;
    }

    // Create new Task object
    const task = {
        name: req.body.name || "",
        type: req.body.type || "",
        priority: req.body.priority || "",
        due: req.body.due, // || "",
        trigger: req.body.trigger || "",
        completed: req.body.completed, // || "",
        note: req.body.note || "",
        userKey: getWhereKey(req)
    };

    // Create Task using Sequelize
    Task.create(task)
        .then((data: TaskType) => {
            res.status(201).send(data);
        })
        .catch((err: ExpressError) => {
            errorHandler(err, req, res);
        });
};

const updateTask = (req: Request, res: Response) => {
    const id = req.params['id'];

    Task.update(req.body, {
        where: {
            id: id
        }
    })
        .then((num: number) => {
            if (num == 1) {
                res.send({
                    message: "Task was updated successfully!"
                });
            } else {
                res.status(404).send({
                    message: `Task with id=${id} could not be found!`
                });
            }
        })
        .catch((err: ExpressError) => {
            errorHandler(err, req, res);
        });
};

const updateTaskForOwner = (req: Request, res: Response) => {
    const id = req.params['id'];

    Task.update(req.body, {
        where: {
            id: id,
            userKey: getWhereKey(req)
        }
    })
        .then((num: number) => {
            if (num == 1) {
                res.send({
                    message: "Task was updated successfully!"
                });
            } else {
                res.status(404).send({
                    message: `Task with id=${id} may not belong to owner or could not be found!`
                });
            }
        })
        .catch((err: ExpressError) => {
            errorHandler(err, req, res);
        });
};

const deleteTask = (req: Request, res: Response) => {
    // url parameter
    const id = req.params['id'];

    // delete specific record
    Task.destroy({
        where: {
            id: id
        }
    })
        .then((num: number) => {
            if (num == 1) {
                return res.status(200).send({
                    message: "Task was deleted!"
                });
            } else {
                res.status(404).send({
                    message: `Task was not found!`
                });
            }
        })
        .catch((err: ExpressError) => {
            errorHandler(err, req, res);
        });
}

const deleteTaskForOwner = (req: Request, res: Response) => {
    // url parameter
    const id = req.params['id'];

    // delete specific record
    Task.destroy({
        where: {
            id: id,
            userKey: getWhereKey(req)
        }
    }).then((num: number) => {
        if (num == 1) {
            return res.status(200).send({
                message: "Task was deleted!"
            });
        } else {
            res.status(404).send({
                message: `Task was not found!`
            });
        }
    })
        .catch((err: ExpressError) => {
            errorHandler(err, req, res);
        });
}

const deleteAllTasks = (req: Request, res: Response) => {

    Task.destroy({
        where: {},
        truncate: false
    })
        .then((nums: number) => {
            res.status(200).send({ message: `${nums} Tasks were deleted successfully!` });
        })
        .catch((err: ExpressError) => {
            errorHandler(err, req, res);
        });
}

const deleteAllTasksForOwner = (req: Request, res: Response) => {

    Task.destroy({
        where: {userKey: getWhereKey(req)},
        truncate: false
    })
        .then((nums: number) => {
            res.status(200).send({ message: `${nums} Tasks were deleted successfully!` });
        })
        .catch((err: ExpressError) => {
            errorHandler(err, req, res);
        });
}

const getWhereKey = (req: Request) => {
    let key: number;
    const user: number  =  parseInt(req.userId);
    const owner: number = parseInt(req.ownerId);

    if (owner === 0) {
        key = user;
        console.log("key " + user);
        return key;
    } else {
        key = owner;
        console.log("bastard key " + owner);
        return key;
    }
}

const taskController = {
    getAllTasks,
    getAllTasksForOwner,
    getTask,
    getTaskForOwner,
    createTaskForOwner,
    updateTask,
    updateTaskForOwner,
    deleteTask,
    deleteTaskForOwner,
    deleteAllTasks,
    deleteAllTasksForOwner
};
export default taskController;
