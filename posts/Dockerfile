# This file is used to create a docker image for the application
FROM node:alpine

# set working directory in the container to /app so that all the files are copied to /app directory in the container 
WORKDIR /app

# install dependencies first to take advantage of caching in docker build process
COPY package.json ./
RUN npm install

# copy the rest of the files to the container /app directory 
COPY ./ ./

# start the application, this is the command that will be executed when the container starts by default
CMD ["npm", "start"]