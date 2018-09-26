#11-14-express-api [![Build Status](https://travis-ci.com/tnorth93/11-14-express-api.svg?branch=master)](https://travis-ci.com/tnorth93/11-14-express-api)
This project is a server that has been built using express). HTTP methods GET, PUT, POST, and DELETE
have been setup and are ready for use.
##Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.
Clone this repo and navigate to a directory on your local machine. Once you have the folder setup where you want to install, use
the command ```git clone <repo link>```.

###Commands to run from terminal to execute routes:
1. ```node src/app.js``` this starts the server
- TO RUN THE FOLLOWING COMMANDS TYPE THEM INTO A NEW TAB IN YOUR TERMINAL AFTER STARTING THE SERVER
2. ```http GET :3000/api/huskies``` retrieves all of the huskies that are stored
3. ```http GET :3000/api/huskies/<insert id here>``` retrieves the husky with the provided id inserted into the path
4. ```http POST :3000/api/huskies name:'Chad' description:'is a dog'``` will create and store a new husky with the provided name and description
5. ```http PUT :3000/api/huskies/<insert if here> name:'Chad' description:'is a dog'``` will update an existing husky with the provided id
6. ```http DELETE :3000/api/huskies/<insert id here>``` will delete a husky with the provided id

##Prerequisites
To install, you'll need a computer with access to the internet, your favorite text editor, your computer's terminal,
and npm installed. Once you have all of those things, use the command ```npm install``` to install all of the dependencies 
required to run the server.

##Running the tests
All you need to run the tests is jest which is included in the package.json and should be installed when you npm install.
Once you have everything installed, use the command ```npm run test```.

##Built With
1. Node
1b. Express
2. JavaScript(ES6)
3. Jest
4. uuid
5. http
6. logger
7. requestParser
8. Faker
9. superagent

##Authors
Tom North

##License
This project is licensed under the MIT License - see the LICENSE.md file for details