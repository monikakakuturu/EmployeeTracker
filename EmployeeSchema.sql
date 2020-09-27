Create database Employee_DB;

Use Employee_DB;

Create Table Employee (
    employeeId int auto_increment not null,
    first_name varchar(30) null,
    last_name varchar(30) null,
    role_id int,
    manager_id int,
    Foreign Key (role_id) References Role(roleId),
    Foreign Key (manager_id) References Employee(employeeId),
    Primary Key (employeeId)
);

Create Table Role (
    roleId int auto_increment not null,
    title varchar(30) null,
    salery decimal,
    department_id int,
    Foreign Key (department_id) References Department(daprtmentId),
    Primary Key (roleId)
);

Create Table Department (
    daprtmentId int auto_increment not null,
    name varchar(30),
    Primary Key (daprtmentId)
);