Create database Employee_DB;

Use Employee_DB;

Create Table Employe (
    id int auto_increment not null,
    first_name varchar(30) null,
    last_name varchar(30) null,
    role_id int,
    manager_id int,
    Primary Key (id)
);

Create Table Role (
    id int auto_increment not null,
    title varchar(30) null,
    salery decimal,
    department_id int,
    Primary Key (id)
);

Create Table Department (
    id int auto_increment not null,
    name varchar(30),
    Primary Key (id)
);