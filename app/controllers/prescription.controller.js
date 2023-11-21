/**
 * VirtualYou
 * @license Apache-2.0
 * @author David L Whitehurst
 */

const db = require("../models");
const {locals} = require("express/lib/application");
const Prescription = db.prescription;

/**
 * This asynchronous controller function returns a list of all Prescriptions.
 * The function here would only be called by ROLE_ADMIN
 *
 * @param {object} req - Callback parameter request.
 * @param {object} res - Callback parameter response.
 * @returns {Promise<void>} - To return all Prescription objects
 */

exports.getAllPrescriptions = (req, res) => {
    Prescription.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Internal server error occurred while retrieving prescriptions."
            });
        });
};

/**
 * This asynchronous controller function returns a list of
 * Prescriptions specifically belonging to the Owner.
 *
 * The function here can be called by ROLE_OWNER, ROLE_AGENT, ROLE_MONITOR
 *
 * @param {object} req - Callback parameter request.
 * @param {object} res - Callback parameter response.
 * @returns {Promise<void>} - To return Prescription objects
 */

exports.getAllPrescriptionsForOwner = (req, res) => {

    if (req.ownerId === 0) {
        console.log("ownerId " + req.ownerId);
        key = req.userId;
    } else {
        key = req.ownerId;
        console.log("ownerId " + req.ownerId);
    }

    Prescription.findAll({
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
                    err.message || "Internal server error occurred while retrieving prescriptions."
            });
        });
};

/**
 * This controller function returns a Prescription
 * based on it's primary key or id.
 *
 * The function here would ONLY be called by ROLE_ADMIN
 *
 * @param {object} req - Callback parameter request.
 * @param {object} res - Callback parameter response.
 * @returns {Promise<void>} - To return Prescription object
 */

exports.getPrescription = (req, res) => {
    const id = req.params.id;

    Prescription.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find Prescription with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Internal server error retrieving Prescription with id=" + id
            });
        });
};

/**
 * This controller function returns a Prescription
 * based on it's id and ONLY IF the Prescription belongs to the
 * Owner.
 *
 * The function here would only be called by ROLE_ADMIN
 *
 * @param {object} req - Callback parameter request.
 * @param {object} res - Callback parameter response.
 * @returns {Promise<void>} - To return Prescription object
 */

exports.getPrescriptionForOwner = (req, res) => {
    const id = req.params.id;

    if (req.ownerId === 0) {
        console.log("ownerId " + req.ownerId);
        key = req.userId;
    } else {
        key = req.ownerId;
        console.log("ownerId " + req.ownerId);
    }

    Prescription.findOne({
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
                    message: `May not belong to Owner or cannot find this Prescription with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Internal server error retrieving Prescription with id=" + id
            });
        });
};

/**
 * This controller function creates a Prescription
 *
 * The function here can be called by ROLE_OWNER and
 * ROLE_AGENT
 *
 * @param {object} req - Callback parameter request.
 * @param {object} res - Callback parameter response.
 * @returns {Promise<void>} - Promise Return
 */
exports.createPrescriptionForOwner = (req, res) => {

    // Check request
    if (!req.body.name) {
        res.status(400).send({
            message: "Bad Request, name cannot be empty!"
        });
        return;
    }

    // Owner may be creating the Prescription
    if (req.ownerId === 0) {
        console.log("key " + req.userId);
        key = req.userId;
    } else {
        key = req.ownerId;
        console.log("key " + req.ownerId);
    }

    // Create new Prescription object
    const prescription = {
        name: req.body.name || "",
        identNo: req.body.identNo || "",
        size: req.body.size || "",
        form: req.body.form || "",
        rxUnit: req.body.rxUnit || "",
        quantity: req.body.quantity || "",
        pharmacy: req.body.pharmacy || "",
        pharmacyPhone: req.body.pharmacyPhone || "",
        written: req.body.written || "",
        writtenBy: req.body.writtenBy || "",
        filled: req.body.filled || "",
        expired: req.body.expired || "",
        refillNote: req.body.refillNote || "",
        manufacturedBy: req.body.manufacturedBy || "",
        note: req.body.note || "",
        userKey: req.body.userKey || 0
    };

    // Create Prescription using Sequelize
    Prescription.create(prescription)
        .then(data => {
            res.status(201).send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "An internal server error occurred creating the Prescription."
            });
        });
};

exports.updatePrescription = (req, res) => {
    const id = req.params.id;

    Prescription.update(req.body, {
        where: {
            id: id
        }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Prescription was updated successfully!"
                });
            } else {
                res.status(404).send({
                    message: `Prescription with id=${id} could not be found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Internal server error occurred while updating Prescription with id=" + id
            });
        });
};

exports.updatePrescriptionForOwner = (req, res) => {
    const id = req.params.id;

    // Owner may be creating the Prescription
    if (req.ownerId === 0) {
        console.log("key " + req.userId);
        key = req.userId;
    } else {
        key = req.ownerId;
        console.log("key " + req.ownerId);
    }

    Prescription.update(req.body, {
        where: {
            id: id,
            userKey: key
        }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Prescription was updated successfully!"
                });
            } else {
                res.status(404).send({
                    message: `Prescription with id=${id} may not belong to owner or could not be found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Internal server error occurred while updating Prescription with id=" + id
            });
        });
};


/**
 * This asynchronous controller function deletes a Prescription
 * based on it's primary key or id.
 *
 * The function here would ONLY be called by ROLE_ADMIN
 *
 * @param {object} req - Callback parameter request.
 * @param {object} res - Callback parameter response.
 * @returns {Promise<void>} - Return Promise
 */

exports.deletePrescription = (req, res) => {
    // url parameter
    const id = req.params.id;

    // delete specific record
    Prescription.destroy({
        where: {
            id: id
        }
    })
        .then(num => {
            if (num == 1) {
                return res.status(200).send({
                    message: "Prescription was deleted!"
                });
            } else {
                res.status(404).send({
                    message: `Prescription was not found!`
                });
            }
        })
        .catch(err => {
            return res.status(500).send({
                message: "Prescription with id=" + id + " could not be deleted!"
            });
        });
}

/**
 * This asynchronous controller function deletes a Prescription
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

exports.deletePrescriptionForOwner = (req, res) => {
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
    Prescription.destroy({
        where: {
            id: id,
            userKey: key
        }
    }).then(num => {
        if (num == 1) {
            return res.status(200).send({
                message: "Prescription was deleted!"
            });
        } else {
            res.status(404).send({
                message: `Prescription was not found!`
            });
        }
    })
        .catch(err => {
            return res.status(500).send({
                message: "Prescription with id=" + id + " could not be deleted!"
            });
        });
}

/**
 * This asynchronous controller function deletes all
 * Prescriptions.
 *
 * The function here would ONLY be called by ROLE_ADMIN
 *
 * @param {object} req - Callback parameter request.
 * @param {object} res - Callback parameter response.
 * @returns {Promise<void>} - Return Promise
 */

exports.deleteAllPrescriptions = (req, res) => {

    Prescription.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.status(200).send({ message: `${nums} Prescriptions were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "An error occurred while truncating prescriptions!"
            });
        });
}

/**
 * This asynchronous controller function deletes all
 * Prescriptions for the session Owner.
 *
 * The function here can be called by ROLE_OWNER and
 * ROLE_AGENT.
 *
 * @param {object} req - Callback parameter request.
 * @param {object} res - Callback parameter response.
 * @returns {Promise<void>} - Return Promise
 */

exports.deleteAllPrescriptionsForOwner = (req, res) => {

    // if ownerId = 0 then user is owner
    if (req.ownerId === 0) {
        console.log("key " + req.userId);
        key = req.userId;
    } else {
        key = req.ownerId;
        console.log("key " + req.ownerId);
    }

    Prescription.destroy({
        where: {userKey: key},
        truncate: false
    })
        .then(nums => {
            res.status(200).send({ message: `${nums} Prescriptions were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "An error occurred while truncating prescriptions!"
            });
        });
}

