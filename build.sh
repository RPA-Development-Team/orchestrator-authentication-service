#!/bin/bash

sudo docker container rm auth
sudo docker build -t orch-auth .
sudo docker run --name auth -it -p 8000:8000 orch-auth
