const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const errorHandler = require("./errors/error-handler");
const userController = require("./Users/controller");
const authenticationController = require("./Authentications/controller");
const taskController = require("./TaskManagements/controller");

const routes = (app) => {
  app.use(cors());

  app.use(morgan("tiny"));

  app.use(express.json());

  app.use("/user", userController);

  app.use("/authentication", authenticationController);

  app.use("/task", taskController);

  app.use("/health_check", (req, res) => {
    return res.status(200).send();
  });

  app.use("/**", (req, res) => {
    return res
      .status(404)
      .send({ error: "There is no route to process your request." });
  });

  app.use(errorHandler);
};

module.exports = routes;
