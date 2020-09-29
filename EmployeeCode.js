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

    inquirer.prompt(departmentQues).then(function (data1) {
      employee.department = data1.department;

      inquirer.prompt(roleQues).then(function (data2) {
        employee.role = data2.role;
        employee.salery = data2.salery;

        inquirer.prompt(hasManagerQues).then(function (data3) {
          employee.hasManager = data3.hasManager;
          if (data3.hasManager == "Yes") {
            inquirer.prompt(managerQues).then(function (data4) {
              employee.managerFirstName = data4.firstName;
              employee.managerLastName = data4.lastName;
              addEmployee(employee);
            });
          } else {
            addEmployee(employee);
          }
        });
      });
    });
  });
}

function addEmployee(employee) {
  var query = "Select daprtmentId From Department Where ";
  query += "name = ?";

  //console.log(employee.department);
  connection.query(query, [employee.department], function (err, res) {
    if (err) throw err;
    var query1 = "Insert Into Role (title, salery, department_id)";
    query1 += " Values (?, ?, ?)";

    connection.query(
      query1,
      [employee.role, employee.salery, res[0].daprtmentId],
      function (err, res1) {
        if (err) throw err;
        //console.log(res1);
        var query2 =
          "Insert Into Employee (first_name, last_name, role_id, manager_id)";
        query2 += " Values (?, ?, ?, ?)";

        if (employee.hasManager == "Yes") {
          var query3 = "Select employeeId From Employee ";
          query3 += "Where Employee.first_name=? And Employee.last_name=?";
          connection.query(
            query3,
            [employee.managerFirstName, employee.managerLastName],
            function (err, res2) {
              if (err) throw err;
              if (res2.length > 0) {
                connection.query(
                  query2,
                  [
                    employee.first_name,
                    employee.last_name,
                    res1.insertId,
                    res2[0].employeeId,
                  ],
                  function (err, res3) {
                    if (err) throw err;
                    initEmployee();
                  }
                );
              } else {
                console.log(
                  "Please select the existing manager's first and last names"
                );
                initEmployee();
              }
            }
          );
        } else {
          connection.query(
            query2,
            [employee.first_name, employee.last_name, res1.insertId, null],
            function (err, res3) {
              if (err) throw err;
              initEmployee();
            }
          );
        }
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

      if (res[i].manager_id != null) {
        for (var j = 0; j < res.length; j++) {
          if (res[i].manager_id == res[j].employeeId) {
            info.Manager = res[j].first_name + " " + res[j].last_name;
            break;
          }
        }
      } else {
        info.Manager = null;
      }
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
  inquirer.prompt(employeeQues).then(function (data) {
    var firstName = data.firstName;
    var lastName = data.lastName;

    var query = "Select Employee.role_id From Employee ";
    query += "Where Employee.first_name = ? And Employee.last_name = ?";

    connection.query(query, [firstName, lastName], function (err, res) {
      if (err) throw err;
      if (res.length > 0) {
        var roleId = res[0].role_id;
        inquirer.prompt(roleQues).then(function (data1) {
          var query1 = "Update Role Set title = ?, salery = ? ";
          query1 += "Where Role.roleId = ?";

          connection.query(
            query1,
            [data1.role, data1.salery, roleId],
            function (err, res1) {
              if (err) throw err;
              initEmployee();
            }
          );
        });
      } else {
        console.log(
          "None of the records match with Employee first name and last name"
        );
        initEmployee();
      }
    });
  });
}
