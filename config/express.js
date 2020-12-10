const express = require("express");
const CP = require("cookie-parser");



function expressConf(app, options) {
  

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(CP());

  app.use(express.static("public"));
}

module.exports = expressConf;