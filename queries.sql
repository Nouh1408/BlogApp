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

CREATE TABLE addresses(
    id int not null AUTO_INCREMENT,
    country varchar(20),
    city varchar(20),
    street varchar(20),
    phone varchar(15),
    userID int not null,
    createdAt timestamp DEFAULT current_timestamp,
    updatedAt timestamp DEFAULT current_timestamp on update current_timestamp,
    PRIMARY KEY(id),
    FOREIGN KEY (userID) REFERENCES users(id) ON DELETE CASCADE ON update CASCADE

);

CREATE TABLE blogs(
    id int not null AUTO_INCREMENT,
    userID int not null,
    title varchar(20),
    content text,
    createdAt timestamp DEFAULT current_timestamp,
    updatedAt timestamp DEFAULT current_timestamp on update current_timestamp,
    PRIMARY KEY(id),
    FOREIGN KEY (userID) REFERENCES users(id) ON DELETE CASCADE ON update CASCADE

);