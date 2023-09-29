const express = require("express");
const app = express();
const employeeRoute = express.Router();
const cors = require("cors");
const dummydata = require("../data.json");

// CORS OPTIONS
var whitelist = ["http://localhost:4200", "http://localhost:4000"];
var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (whitelist.indexOf(req.header("Origin")) !== -1) {
    corsOptions = {
      origin: "*",
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    };
  } else {
    corsOptions = { origin: false }; // disable CORS for this request
  }
  callback(null, corsOptions);
};

function makeid(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

// Add Employee
employeeRoute.route("/create").post(async (req, res, next) => {
  dummydata.push({ _id: makeid(11) + Date.now(), ...req.body })
  res.json({
    data: req.body,
    message: "Data successfully added!",
    status: 200,
  });
});

// Get All Employees
employeeRoute.route("/", cors(corsOptionsDelegate)).post(async (req, res, next) => {

  const { pageNumber, size, totalPages, column, order } = req.body;


  let sorted;

  if (order === 'asc') {
    sorted = dummydata.sort((a, b) => a[column] - b[column]);
  } else {
    sorted = dummydata.sort((a, b) => b[column] - a[column]);
  }

  const tatal = sorted.length

  const fromIndex = (pageNumber * size)
  const toIndex = ((pageNumber + 1) * size)

  // console.log(sorted[0].name)

  return res.json({
    page: {
      totalElements: tatal,
      pageNumber,
      size,
      totalPages,
    },
    data: sorted.slice(fromIndex, toIndex)
    // data: sorted
  });
});

// Get single employee
employeeRoute.route("/read/:id").get(async (req, res, next) => {
  res.json({
    data: dummydata.find((item) => req.params.id == item._id),
    message: "Data successfully retrieved.",
    status: 200,
  });
});

// Update employee
employeeRoute.route("/update/:id").put(async (req, res, next) => {

  const index = dummydata.findIndex(item => item._id === req.params.id);

  const updated = { _id: req.params.id, ...req.body };

  dummydata.splice(index, 1, updated)

  res.json({
    data: updated,
    msg: "Data successfully updated.",
  });
});

// Delete employee
employeeRoute.route("/delete/:id").delete(async (req, res) => {

  const index = dummydata.findIndex(item => item._id === req.params.id);

  dummydata.splice(index, 1)

  res.json({
    msg: "Data successfully updated.",
  });
});

module.exports = employeeRoute;
