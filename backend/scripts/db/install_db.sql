CREATE DATABASE orchestratordb;
USE orchestratordb;
CREATE TABLE user (
  id int NOT NULL AUTO_INCREMENT,
  username varchar(45) DEFAULT NULL,
  password varchar(150) DEFAULT NULL,
  role varchar(45) DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY username_UNIQUE (username)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
