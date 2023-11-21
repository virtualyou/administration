const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const app = express();

require('dotenv').config();
const USERAUTH_SERVER_PORT_URL = process.env.USERAUTH_SERVER_PORT_URL;

app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(
    cookieSession({
      name: "virtualyou-session",
      keys: ["COOKIE_SECRET"], // should use as secret environment variable
      httpOnly: true,
      sameSite: 'strict'
    })
);

const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function(app) {
  app.use(
      '/userauth',
      createProxyMiddleware({
        target: USERAUTH_SERVER_PORT_URL,
        changeOrigin: true,
      })
  );
};

// database
const db = require("./app/models");
const Prescription = db.prescription;
/*
db.sequelize.sync({force: true}).then(() => {
        console.log('Drop and Recreate Db');
        initial();
});
*/
db.sequelize.sync();

// swagger api documentation
const swaggerUi = require("swagger-ui-express"),
    swaggerDocument = require("./swagger.json");

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the VirtualYou Medical Secure API Express application." });
});

// routes
require("./app/routes/prescription.routes")(app);

// swagger path to api documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// set port, listen for requests
const PORT = process.env.PORT || 3007;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

/*
  {
    "name": "Metformin",
    "identNo": "6792303",
    "size": "",
    "form": "tablet",
    "rxUnit": "500mg",
    "quantity": "60",
    "pharmacy": "Kroger",
    "pharmacyPhone": "919-567-5499",
    "written": "10/23/2023",
    "writtenBy": "Dr. Smith",
    "filled": "10/23/2023",
    "expired": "10/23/2025",
    "refillNote": "2 refills by 02/07/2024",
    "manufacturedBy": "Mylan",
    "note": "Take with food",
    "userKey": 10
  }
*/

function initial() {
  Prescription.create({
    name: "Metformin",
    identNo: "6792303",
    size: "",
    form: "tablet",
    rxUnit: "500mg",
    quantity: "60",
    pharmacy: "Kroger",
    pharmacyPhone: "919-567-5499",
    written: "10/23/2023",
    writtenBy: "Dr. Smith",
    filled: "10/23/2023",
    expired: "10/23/2025",
    refillNote: "2 refills by 02/07/2024",
    manufacturedBy: "Mylan",
    note: "Take with food",
    userKey: 10
  });

  Prescription.create({
    name: "Pravastatin",
    identNo: "6733303",
    size: "",
    form: "tablet",
    rxUnit: "20mg",
    quantity: "60",
    pharmacy: "Kroger",
    pharmacyPhone: "919-567-5499",
    written: "10/23/2023",
    writtenBy: "Dr. Smith",
    filled: "10/23/2023",
    expired: "10/23/2025",
    refillNote: "2 refills by 02/07/2024",
    manufacturedBy: "Zocor",
    note: "Take one tablet nightly",
    userKey: 10
  });

  Prescription.create({
    name: "Amlodipine",
    identNo: "6802323",
    size: "",
    form: "tablet",
    rxUnit: "10mg",
    quantity: "60",
    pharmacy: "Kroger",
    pharmacyPhone: "919-567-5499",
    written: "10/23/2023",
    writtenBy: "Dr. Smith",
    filled: "10/23/2023",
    expired: "10/23/2025",
    refillNote: "2 refills by 02/07/2024",
    manufacturedBy: "Eli Lily",
    note: "Take as needed",
    userKey: 10
  });
}
