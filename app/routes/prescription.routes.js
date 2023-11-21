/**
 * VirtualYou
 * @license Apache-2.0
 * @author David L Whitehurst
 */

const { authJwt } = require("../utility");
const controller = require("../controllers/prescription.controller");

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
    // GET - all prescriptions
    app.get(
        "/medical/v1/prescriptions",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.getAllPrescriptions
    );

    // GET - a prescription by id
    app.get(
        "/medical/v1/prescriptions/:id",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.getPrescription
    );

    // PUT - update a prescription by id
    app.put(
        "/medical/v1/prescriptions/:id",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.updatePrescription
    );

    // DELETE - a prescription by id
    app.delete(
        "/medical/v1/prescriptions/:id",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.deletePrescription
    );

    // DELETE - all prescriptions
    app.delete(
        "/medical/v1/prescriptions",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.deleteAllPrescriptions
    );

    /*
     * ************************************************************************
     * OWNER, AGENT, (MONITOR?) USER
     * ************************************************************************
     */

    // GET - all prescriptions for owner
    app.get(
        "/medical/v1/owner/prescriptions",
        [authJwt.verifyToken, authJwt.isOwnerOrAgentOrMonitor],
        controller.getAllPrescriptionsForOwner
    );

    // GET - prescription by id for owner only
    app.get(
        "/medical/v1/owner/prescriptions/:id",
        [authJwt.verifyToken, authJwt.isOwnerOrAgentOrMonitor],
        controller.getPrescriptionForOwner
    );

    // POST - create a new Prescription for owner (owner or agent cognizant of userKey)
    app.post(
        "/medical/v1/owner/prescriptions",
        [authJwt.verifyToken, authJwt.isOwnerOrAgent],
        controller.createPrescriptionForOwner
    );

    // PUT - update a prescription for owner only
    app.put(
        "/medical/v1/owner/prescriptions/:id",
        [authJwt.verifyToken, authJwt.isOwnerOrAgent],
        controller.updatePrescriptionForOwner
    );

    // DELETE - delete a prescription by id for owner only
    app.delete(
        "/medical/v1/owner/prescriptions/:id",
        [authJwt.verifyToken, authJwt.isOwnerOrAgent],
        controller.deletePrescriptionForOwner
    );

    // DELETE - all prescriptions for owner only
    app.delete(
        "/medical/v1/owner/prescriptions",
        [authJwt.verifyToken, authJwt.isOwnerOrAgent],
        controller.deleteAllPrescriptionsForOwner
    );

};

