FROM node:18.14.1
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
COPY ./src/.env /app/node_modules/rpa-prisma-module/.env
EXPOSE 8000
CMD ["npm", "start"]