/**
 * VirtualYou
 * @license Apache-2.0
 * @author David L Whitehurst
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

