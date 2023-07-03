FROM node:18.14.1
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
COPY ./src/.env /app/node_modules/rpa-prisma-module/.env
COPY ./node_modules/rpa-prisma-module/prisma/schema.prisma /app/node_modules/rpa-prisma-module/prisma/schema.prisma
EXPOSE 8000
CMD ["npm", "start"]