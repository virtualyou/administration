const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");

require('dotenv').config();
const USERAUTH_SERVER_PORT_URL = process.env.USERAUTH_SERVER_PORT_URL;

verifyToken = (req, res, next) => {
  let token = req.session.token;

  if (!token) {
    console.log("no token?");
    return res.status(403).send({
      message: "No token provided!",
    });
  }

  jwt.verify(token,
      config.secret,
      (err, decoded) => {
        if (err) {
          console.log("JWT did not verify!");
          return res.status(401).send({
            message: "Unauthorized!",
          });
        }
        req.userId = decoded.id;
        req.ownerId = decoded.owner;
        console.log("The owner id is: " + req.ownerId);
        console.log("The JWT token has been verified. We have authentication.");
        next();
      });
};

// TODO -> refactor into one method to reduce code duplication
isAdmin = async (req, res, next) => {
  try {
    const userid = req.userId;
    const cookieHeader = req.headers.cookie;
    const roles = await fetchData(userid, cookieHeader);

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        return next();
      }
    }

    return res.status(403).send({
      message: "Require Admin Role!",
    });

  } catch (error) {
    return res.status(500).send({
      message: "Unable to validate Admin role!",
    });
  }
};

isOwner = async (req, res, next) => {
  try {
    const userid = req.userId;
    const cookieHeader = req.headers.cookie;
    const roles = await fetchData(userid, cookieHeader);

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "owner") {
        return next();
      }
    }

    return res.status(403).send({
      message: "Require Owner Role!",
    });

  } catch (error) {
    return res.status(500).send({
      message: "Unable to validate Owner role!",
    });
  }
};

isOwnerOrAgent = async (req, res, next) => {
  try {
    const userid = req.userId;
    const cookieHeader = req.headers.cookie;
    const roles = await fetchData(userid, cookieHeader);

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "owner" || roles[i].name === "agent") {
        return next();
      }
    }

    return res.status(403).send({
      message: "Requires either Owner or Agent Role!",
    });

  } catch (error) {
    return res.status(500).send({
      message: "Unable to validate Owner or Agent roles!",
    });
  }
};

isOwnerOrAgentOrMonitor = async (req, res, next) => {
  try {
    const userid = req.userId;
    const cookieHeader = req.headers.cookie;
    const roles = await fetchData(userid, cookieHeader);

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "owner" || roles[i].name === "agent" || roles[i].name === "monitor") {
        return next();
      }
    }

    return res.status(403).send({
      message: "Requires either Owner, Agent, or Monitor Role!",
    });

  } catch (error) {
    return res.status(500).send({
      message: "Unable to validate Owner, Agent, or Monitor roles!",
    });
  }
};

isAgent = async (req, res, next) => {
  try {
    const userid = req.userId;
    const cookieHeader = req.headers.cookie;
    const roles = await fetchData(userid, cookieHeader);

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "agent") {
        return next();
      }
    }

    return res.status(403).send({
      message: "Require Agent Role!",
    });

  } catch (error) {
    return res.status(500).send({
      message: "Unable to validate Agent role!",
    });
  }
};

isMonitor = async (req, res, next) => {
  try {
    const userid = req.userId;
    const cookieHeader = req.headers.cookie;
    const roles = await fetchData(userid, cookieHeader);

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "monitor") {
        return next();
      }
    }

    return res.status(403).send({
      message: "Require Monitor Role!",
    });

  } catch (error) {
    return res.status(500).send({
      message: "Unable to validate Monitor role!",
    });
  }
};

// Fetch all User Roles (Private)
async function fetchData(id, cookie) {
  try {
    const response = await fetch(USERAUTH_SERVER_PORT_URL + '/userauth/v1/users/' + id + '/roles', {
      headers: {
        cookie
      }
    });

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
  }
}

const authJwt = {
  verifyToken,
  isAdmin,
  isOwner,
  isOwnerOrAgent,
  isOwnerOrAgentOrMonitor,
  isAgent,
  isMonitor,
};
module.exports = authJwt;
