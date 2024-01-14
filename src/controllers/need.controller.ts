
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
 * need.controller.ts
 */

import { Request, Response } from 'express';
import db from '../models';
const Need = db.need;

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

const getAllNeeds = (_req: Request, res: Response) => {
    Need.findAll()
        .then((data: NeedType) => {
            res.send(data);
        })
        .catch((err: ExpressError) => {
            errorHandler(err, _req, res);
        });
};

const getAllNeedsForOwner = (req: Request, res: Response) => {

    Need.findAll({
            where: {
                userKey: getWhereKey(req),
            },
        }
    )
        .then((data: NeedType) => {
            res.send(data);
        })
        .catch((err: ExpressError) => {
            errorHandler(err, req, res);
        });
};

const getNeed = (req: Request, res: Response) => {
    const id = req.params['id'];

    Need.findByPk(id)
        .then((data: NeedType) => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find Need with id=${id}.`
                });
            }
        })
        .catch((err: ExpressError) => {
            errorHandler(err, req, res);
        });
};

const getNeedForOwner = (req: Request, res: Response) => {
    const id = req.params['id'];

    Need.findOne({
        where: {
            id: id,
            userKey: getWhereKey(req)
        }
    })
        .then((data: NeedType) => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `May not belong to Owner or cannot find this Need with id=${id}.`
                });
            }
        })
        .catch((err: ExpressError) => {
            errorHandler(err, req, res);
        });
};

const createNeedForOwner = (req: Request, res: Response) => {

    // Check request
    if (!req.body.name) {
        res.status(400).send({
            message: "Bad Request, name cannot be empty!"
        });
        return;
    }

    // Create new Need object
    const need = {
        name: req.body.name || "",
        quantity: parseInt(req.body.quantity || "0"),
        unit: req.body.unit || "",
        urgency: req.body.urgency || "",
        note: req.body.note || "",
        userKey: getWhereKey(req)
    };

    // Create Need using Sequelize
    Need.create(need)
        .then((data: NeedType) => {
            res.status(201).send(data);
        })
        .catch((err: ExpressError) => {
            errorHandler(err, req, res);
        });
};

const updateNeed = (req: Request, res: Response) => {
    const id = req.params['id'];

    Need.update(req.body, {
        where: {
            id: id
        }
    })
        .then((num: number) => {
            if (num == 1) {
                res.send({
                    message: "Need was updated successfully!"
                });
            } else {
                res.status(404).send({
                    message: `Need with id=${id} could not be found!`
                });
            }
        })
        .catch((err: ExpressError) => {
            errorHandler(err, req, res);
        });
};

const updateNeedForOwner = (req: Request, res: Response) => {
    const id = req.params['id'];

    Need.update(req.body, {
        where: {
            id: id,
            userKey: getWhereKey(req)
        }
    })
        .then((num: number) => {
            if (num == 1) {
                res.send({
                    message: "Need was updated successfully!"
                });
            } else {
                res.status(404).send({
                    message: `Need with id=${id} may not belong to owner or could not be found!`
                });
            }
        })
        .catch((err: ExpressError) => {
            errorHandler(err, req, res);
        });
};

const deleteNeed = (req: Request, res: Response) => {
    // url parameter
    const id = req.params['id'];

    // delete specific record
    Need.destroy({
        where: {
            id: id
        }
    })
        .then((num: number) => {
            if (num == 1) {
                return res.status(200).send({
                    message: "Need was deleted!"
                });
            } else {
                res.status(404).send({
                    message: `Need was not found!`
                });
            }
        })
        .catch((err: ExpressError) => {
            errorHandler(err, req, res);
        });
}

const deleteNeedForOwner = (req: Request, res: Response) => {
    // url parameter
    const id = req.params['id'];

    // delete specific record
    Need.destroy({
        where: {
            id: id,
            userKey: getWhereKey(req)
        }
    }).then((num: number) => {
        if (num == 1) {
            return res.status(200).send({
                message: "Need was deleted!"
            });
        } else {
            res.status(404).send({
                message: `Need was not found!`
            });
        }
    })
        .catch((err: ExpressError) => {
            errorHandler(err, req, res);
        });
}

const deleteAllNeeds = (req: Request, res: Response) => {

    Need.destroy({
        where: {},
        truncate: false
    })
        .then((nums: number) => {
            res.status(200).send({ message: `${nums} Needs were deleted successfully!` });
        })
        .catch((err: ExpressError) => {
            errorHandler(err, req, res);
        });
}

const deleteAllNeedsForOwner = (req: Request, res: Response) => {

    Need.destroy({
        where: {userKey: getWhereKey(req)},
        truncate: false
    })
        .then((nums: number) => {
            res.status(200).send({ message: `${nums} Needs were deleted successfully!` });
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

const needController = {
    getAllNeeds,
    getAllNeedsForOwner,
    getNeed,
    getNeedForOwner,
    createNeedForOwner,
    updateNeed,
    updateNeedForOwner,
    deleteNeed,
    deleteNeedForOwner,
    deleteAllNeeds,
    deleteAllNeedsForOwner
};
export default needController;
