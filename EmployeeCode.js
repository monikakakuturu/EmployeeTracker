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

const managerQues = [
  {
    type: "input",
    name: "firstName",
    message: "Enter the Manager's First Name:",
  },
  {
    type: "input",
    name: "lastName",
    message: "Enter the Manager's Last Name:",
  },
];

const hasManagerQues = [
  {
    type: "list",
    message: "Does the Employee has the manager:",
    name: "hasManager",
    choices: ["Yes", "No"],
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
  inquirer.prompt(employeeQues).then(function (data) {
    var employee = new Object();
    employee.first_name = data.firstName;
    employee.last_name = data.lastName;

    inquirer.prompt(departmentQues).then(function (data) {
      employee.department = data.department;

      inquirer.prompt(roleQues).then(function (data) {
        employee.role = data.role;
        employee.salery = data.salery;

        inquirer.prompt(hasManagerQues).then(function (data) {
          employee.hasManager = data.hasManager;
          if (data.hasManager == "Yes") {
            inquirer.prompt(hasManagerQues).then(function (data) {
              employee.managerFirstName = data.firstName;
              employee.managerLastName = data.lastName;
            });
          }

          addEmployee(employee);
        });
      });
    });
  });
}

function addEmployee(employee) {
  var query = "Select daprtmentId From Department Where ";
  query += "name = ?";

  console.log(employee.department);
  connection.query(query, [employee.department], function (err, res) {
    if (err) throw err;
    var query1 = "Insert Into Role (title, salery, department_id)";
    query1 += " Values (?, ?, ?)";

    connection.query(
      query1,
      [employee.role, employee.salery, res[0].daprtmentId],
      function (err, res1) {
        if (err) throw err;
        console.log(res1);
        var query2 =
          "Insert Into Employee (first_name, last_name, role_id, manager_id)";
        query2 += " Values (?, ?, ?, ?)";
        var managerId = null;
        if (employee.hasManager == "Yes") {
          connection.query(
            query2,
            [employee.managerFirstName, employee.managerLastName, null, null],
            function (err, res2) {
              if (err) throw err;
              console.log(res2);
              managerId = res2.insertId;
              console.log(managerId);
            }
          );
        }

        connection.query(
          query2,
          [employee.first_name, employee.last_name, res1.insertId, managerId],
          function (err, res3) {
            if (err) throw err;
            initEmployee();
          }
        );
      }
    );
  });
}

function addDepartmentInfo() {
  initEmployee();
}

function addRoleInfo() {
  initEmployee();
}

function viewEmployeeInfo() {
  var query =
    "Select Employee.employeeId, Employee.first_name, Employee.last_name, Employee.manager_id, Role.title, Department.name, Role.salery";
  query += " From Employee Join Role On Employee.role_id = Role.roleId";
  query +=
    " Join Department On Role.department_id = Department.daprtmentId Order by employeeId";

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
      info.ManagerId = res[i].manager_id;

      // Work this to get manager name and display
      // if (res[i].manager_id != null) {
      //   var query1 = "Select Employee.first_name, Employee.last_name";
      //   query1 += " From Employee Inner Join Employee E2 On ? = E2.employeeId";
      //   //console.log(res[i].manager_id);
      //   connection.query(query1, [res[i].manager_id], function (err, res1) {
      //     if (err) throw err;
      //     //console.log(res1);
      //     if (res1.length > 0) {
      //       console.log(res1[0]);
      //       info.Manager = Json.stringify(
      //         res1[0].first_name + " " + res1[0].last_name
      //       );
      //     }
      //   });
      // } else {
      //   info.Manager = null;
      // }
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
