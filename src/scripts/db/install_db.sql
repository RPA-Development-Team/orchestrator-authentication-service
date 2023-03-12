CREATE DATABASE orchestratordb;
\c orchestratordb
CREATE TABLE "user" (
  id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username varchar(45) DEFAULT NULL,
  password varchar(150) DEFAULT NULL,
  role varchar(45) DEFAULT NULL,
  UNIQUE(username)
);
