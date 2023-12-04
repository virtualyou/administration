
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


const db = require("../models");
const {locals} = require("express/lib/application");
const Task = db.task;

/**
 * This asynchronous controller function returns a list of all Tasks.
 * The function here would only be called by ROLE_ADMIN
 *
 * @param {object} req - Callback parameter request.
 * @param {object} res - Callback parameter response.
 * @returns {Promise<void>} - To return all Task objects
 */

exports.getAllTasks = (req, res) => {
    Task.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Internal server error occurred while retrieving tasks."
            });
        });
};

/**
 * This asynchronous controller function returns a list of
 * Tasks specifically belonging to the Owner.
 *
 * The function here can be called by ROLE_OWNER, ROLE_AGENT, ROLE_MONITOR
 *
 * @param {object} req - Callback parameter request.
 * @param {object} res - Callback parameter response.
 * @returns {Promise<void>} - To return Task objects
 */

exports.getAllTasksForOwner = (req, res) => {

    if (req.ownerId === 0) {
        console.log("ownerId " + req.ownerId);
        key = req.userId;
    } else {
        key = req.ownerId;
        console.log("ownerId " + req.ownerId);
    }

    Task.findAll({
            where: {
                userKey: key,
            },
        }
    )
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Internal server error occurred while retrieving tasks."
            });
        });
};

/**
 * This controller function returns a Task
 * based on it's primary key or id.
 *
 * The function here would ONLY be called by ROLE_ADMIN
 *
 * @param {object} req - Callback parameter request.
 * @param {object} res - Callback parameter response.
 * @returns {Promise<void>} - To return Task object
 */

exports.getTask = (req, res) => {
    const id = req.params.id;

    Task.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find Task with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Internal server error retrieving Task with id=" + id
            });
        });
};

/**
 * This controller function returns a Task
 * based on it's id and ONLY IF the Task belongs to the
 * Owner.
 *
 * The function here would only be called by ROLE_ADMIN
 *
 * @param {object} req - Callback parameter request.
 * @param {object} res - Callback parameter response.
 * @returns {Promise<void>} - To return Task object
 */

exports.getTaskForOwner = (req, res) => {
    const id = req.params.id;

    if (req.ownerId === 0) {
        console.log("ownerId " + req.ownerId);
        key = req.userId;
    } else {
        key = req.ownerId;
        console.log("ownerId " + req.ownerId);
    }

    Task.findOne({
        where: {
            id: id,
            userKey: key
        }
    })
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `May not belong to Owner or cannot find this Task with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Internal server error retrieving Task with id=" + id
            });
        });
};

/**
 * This controller function creates a Task
 *
 * The function here can be called by ROLE_OWNER and
 * ROLE_AGENT
 *
 * @param {object} req - Callback parameter request.
 * @param {object} res - Callback parameter response.
 * @returns {Promise<void>} - Promise Return
 */
exports.createTaskForOwner = (req, res) => {

    // Check request
    if (!req.body.name) {
        res.status(400).send({
            message: "Bad Request, name cannot be empty!"
        });
        return;
    }

    // Owner may be creating the Task
    if (req.ownerId === 0) {
        console.log("key " + req.userId);
        key = req.userId;
    } else {
        key = req.ownerId;
        console.log("key " + req.ownerId);
    }

    // Create new Task object
    const task = {
        name: req.body.name || "",
        type: req.body.type || "",
        priority: req.body.priority || "",
        due: req.body.due || "",
        trigger: req.body.trigger || "",
        completed: req.body.completed || "",
        note: req.body.note || "",
        userKey: req.body.userKey || 0
    };

    // Create Task using Sequelize
    Task.create(task)
        .then(data => {
            res.status(201).send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "An internal server error occurred creating the Task."
            });
        });
};

exports.updateTask = (req, res) => {
    const id = req.params.id;

    Task.update(req.body, {
        where: {
            id: id
        }
    })
        .then(num => {
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
        .catch(err => {
            res.status(500).send({
                message: "Internal server error occurred while updating Task with id=" + id
            });
        });
};

exports.updateTaskForOwner = (req, res) => {
    const id = req.params.id;

    // Owner may be creating the Task
    if (req.ownerId === 0) {
        console.log("key " + req.userId);
        key = req.userId;
    } else {
        key = req.ownerId;
        console.log("key " + req.ownerId);
    }
    console.log("using id and userKey respectively: " + id + "-" + key);
    Task.update(req.body, {
        where: {
            id: id,
            userKey: key
        }
    })
        .then(num => {
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
        .catch(err => {
            res.status(500).send({
                message: "Internal server error occurred while updating Task with id=" + id
            });
        });
};


/**
 * This asynchronous controller function deletes a Task
 * based on it's primary key or id.
 *
 * The function here would ONLY be called by ROLE_ADMIN
 *
 * @param {object} req - Callback parameter request.
 * @param {object} res - Callback parameter response.
 * @returns {Promise<void>} - Return Promise
 */

exports.deleteTask = (req, res) => {
    // url parameter
    const id = req.params.id;

    // delete specific record
    Task.destroy({
        where: {
            id: id
        }
    })
        .then(num => {
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
        .catch(err => {
            return res.status(500).send({
                message: "Task with id=" + id + " could not be deleted!"
            });
        });
}

/**
 * This asynchronous controller function deletes a Task
 * based on it's id and ONLY if it belongs to the
 * Owner.
 *
 * The function here can be called by ROLE_OWNER and
 * ROLE_AGENT.
 *
 * @param {object} req - Callback parameter request.
 * @param {object} res - Callback parameter response.
 * @returns {Promise<void>} - Return Promise
 */

exports.deleteTaskForOwner = (req, res) => {
    // url parameter
    const id = req.params.id;

    // if ownerId = 0 then user is owner
    if (req.ownerId === 0) {
        console.log("key " + req.userId);
        key = req.userId;
    } else {
        key = req.ownerId;
        console.log("key " + req.ownerId);
    }

    // delete specific record
    Task.destroy({
        where: {
            id: id,
            userKey: key
        }
    }).then(num => {
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
        .catch(err => {
            return res.status(500).send({
                message: "Task with id=" + id + " could not be deleted!"
            });
        });
}

/**
 * This asynchronous controller function deletes all
 * Tasks.
 *
 * The function here would ONLY be called by ROLE_ADMIN
 *
 * @param {object} req - Callback parameter request.
 * @param {object} res - Callback parameter response.
 * @returns {Promise<void>} - Return Promise
 */

exports.deleteAllTasks = (req, res) => {

    Task.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.status(200).send({ message: `${nums} Tasks were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "An error occurred while truncating tasks!"
            });
        });
}

/**
 * This asynchronous controller function deletes all
 * Tasks for the session Owner.
 *
 * The function here can be called by ROLE_OWNER and
 * ROLE_AGENT.
 *
 * @param {object} req - Callback parameter request.
 * @param {object} res - Callback parameter response.
 * @returns {Promise<void>} - Return Promise
 */

exports.deleteAllTasksForOwner = (req, res) => {

    // if ownerId = 0 then user is owner
    if (req.ownerId === 0) {
        console.log("key " + req.userId);
        key = req.userId;
    } else {
        key = req.ownerId;
        console.log("key " + req.ownerId);
    }

    Task.destroy({
        where: {userKey: key},
        truncate: false
    })
        .then(nums => {
            res.status(200).send({ message: `${nums} Tasks were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "An error occurred while truncating tasks!"
            });
        });
}

