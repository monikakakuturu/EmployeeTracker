var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require("console.table");

const actionQues = [
  {
    type: "list",
    message: "What would you like to do?",
    name: "action",
    choices: [
      "Add Employee",
      "View All Employees",
      "Update Employee Roles",
      "Exit",
    ],
  },
];

const employeeQues = [
  {
    type: "input",
    name: "firstName",
    message: "Enter the Employee's First Name:",
  },
  {
    type: "input",
    name: "lastName",
    message: "Enter the Employee's Last Name:",
  },
];

const departmentQues = [
  {
    type: "list",
    message: "Select the Employee's department:",
    name: "department",
    choices: ["Engineering", "Sales", "Finance", "Human Resource"],
  },
];

const roleQues = [
  {
    type: "list",
    message: "Select the Employee's role:",
    name: "role",
    choices: [
      "Software Engineer",
      "Lead Engineer",
      "Sales Manager",
      "Sales Person",
      "Account Manager",
      "Accountant",
      "HR Assistant",
      "HR Manager",
    ],
  },
  {
    type: "input",
    name: "salery",
    message: "Enter the Employee's salery:",
  },
];

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "reddy4@Ma",
  database: "Employee_DB",
});

connection.connect(function (err) {
  if (err) throw err;
  initEmployee();
});

function initEmployee() {
  inquirer.prompt(actionQues).then(function (data) {
    checkActionType(data.action);
  });
}

function checkActionType(action) {
  switch (action) {
    case "Add Employee":
      addEmployeeInfo();
      break;
    case "Add Department":
      addDepartmentInfo();
      break;
    case "Add Role":
      addRoleInfo();
      break;
    case "View All Employees":
      viewEmployeeInfo();
      break;
    case "View All Roles":
      viewRoleInfo();
      break;
    case "View All Departments":
      viewDepartmentInfo();
      break;
    case "Update Employee Roles":
      updateEmployeeRoles();
      break;
    default:
      console.log("Finished Action Items");
      break;
  }
}

function addEmployeeInfo() {
  initEmployee();
}

function addDepartmentInfo() {
  initEmployee();
}

function addRoleInfo() {
  initEmployee();
}

function viewEmployeeInfo() {
  var query =
    "Select Employee.employeeId, Employee.first_name, Employee.last_name, Role.title, Department.name, Role.salery";
  query += " From Employee Join Role On Employee.role_id = Role.roleId";
  query += " Join Department On Role.department_id = Department.daprtmentId";

  connection.query(query, function (err, res) {
    if (err) throw err;
    var table = [];

    for (var i = 0; i < res.length; i++) {
      var info = new Object();
      info.Id = res[i].employeeId;
      info.FirstName = res[i].first_name;
      info.LastName = res[i].last_name;
      info.Title = res[i].title;
      info.Dapartment = res[i].name;
      info.salery = res[i].salery;
      table.push(info);
    }

    console.table(table);
    initEmployee();
  });
}

function viewRoleInfo() {
  initEmployee();
}

function viewDepartmentInfo() {
  initEmployee();
}

function updateEmployeeRoles() {
  initEmployee();
}
