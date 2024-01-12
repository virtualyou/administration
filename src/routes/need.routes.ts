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
import needController from "../controllers/need.controller";
import authJwt from '../utility/authJwt';
import express from 'express';

const needRouter = express();

needRouter.use(function (_req: Request, res: Response, next: NextFunction) {
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
// GET - all needs
needRouter.get(
    "/administration/v1/needs",
    [authJwt.verifyToken, authJwt.isAdmin],
    needController.getAllNeeds
);

// GET - a need by id
needRouter.get(
    "/administration/v1/needs/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    needController.getNeed
);

// PUT - update a need by id
needRouter.put(
    "/administration/v1/needs/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    needController.updateNeed
);

// DELETE - a need by id
needRouter.delete(
    "/administration/v1/needs/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    needController.deleteNeed
);

// DELETE - all needs
needRouter.delete(
    "/administration/v1/needs",
    [authJwt.verifyToken, authJwt.isAdmin],
    needController.deleteAllNeeds
);

/*
 * ************************************************************************
 * Owner related
 * ************************************************************************
 */

// GET - all needs for owner
needRouter.get(
    "/administration/v1/owner/needs",
    [authJwt.verifyToken, authJwt.isOwnerOrAgentOrMonitor],
    needController.getAllNeedsForOwner
);

// GET - need by id for owner only
needRouter.get(
    "/administration/v1/owner/needs/:id",
    [authJwt.verifyToken, authJwt.isOwnerOrAgentOrMonitor],
    needController.getNeedForOwner
);

// POST - create a new Need for owner (owner or agent cognizant of userKey)
needRouter.post(
    "/administration/v1/owner/needs",
    [authJwt.verifyToken, authJwt.isOwnerOrAgent],
    needController.createNeedForOwner
);

// PUT - update a need for owner only
needRouter.put(
    "/administration/v1/owner/needs/:id",
    [authJwt.verifyToken, authJwt.isOwnerOrAgent],
    needController.updateNeedForOwner
);

// DELETE - delete a need by id for owner only
needRouter.delete(
    "/administration/v1/owner/needs/:id",
    [authJwt.verifyToken, authJwt.isOwnerOrAgent],
    needController.deleteNeedForOwner
);

// DELETE - all needs for owner only
needRouter.delete(
    "/administration/v1/owner/needs",
    [authJwt.verifyToken, authJwt.isOwnerOrAgent],
    needController.deleteAllNeedsForOwner
);

export default needRouter;

