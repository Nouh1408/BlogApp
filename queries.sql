CREATE DATABASE blog

CREATE TABLE users(
    id int not null AUTO_INCREMENT,
    firstName varchar(20) not null,
    lastName varchar(20) not null,
    email varchar(100) unique not null,
    password varchar(100) not null,
    dob date null,
    status ENUM('online', 'offline') default 'offline',
    createdAt timestamp DEFAULT current_timestamp,
    updatedAt timestamp DEFAULT current_timestamp on update current_timestamp,
    PRIMARY KEY(id)
);