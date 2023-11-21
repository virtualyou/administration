const DataTypes = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    return sequelize.define("tasks", {
        name: {
            type: Sequelize.STRING
        },
        type: {
            type: Sequelize.STRING
        },
        priority: {
            type: Sequelize.STRING
        },
        due: {
            type: DataTypes.DATE,
        },
        completed: {
            type: DataTypes.DATE,
        },
        trigger: {
            type: Sequelize.STRING
        },
        note: {
            type: Sequelize.STRING
        },
        userKey: {
            type: Sequelize.INTEGER
        }
    });
};

/*
  Task.create({
    name: "Send Taxes",
    type: "Obligation",
    priority: "High",
    due: "04/15/2024",
    trigger: "Pending W-2",
    completed: "",
    note: "",
    userKey: 10
  });
*/