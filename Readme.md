This application is made by:\
Niki Ryom Hansen, #101293661

To run the react part of this application, read 'Run it locally'

## Welcome to ChatAway!
ChatAway is a Web-Application that serves as a communication tool.
In ChatAway you can find different rooms and will be able to communicate with other
users in the same room.

#### How to use the app
ChatAway is hosted on Heroku and therefore there is nothing further for you to do, 
other than enter this URL into the address bar:\
http://chattingallday.herokuapp.com/

#### API
For information about available API calls please visit:\
http://chattingallday.herokuapp.com/api

#### Run it locally
To run the node.js chat application go to the project's root directory and run the terminal command:\
npm install \
npm start

The chat application is now to be found on your localhost, port: 3000

To run the react admin application go to the project's root directory and run the following commands in the terminal:\
cd client\
npm install\
npm start

The react application and the node.js application are connected via a proxy - Meaning that you need to have 
the Node.js server running before you can access any of the requests sent from the react application.
The Node.js server must be running at all times when using the react application

The react application should open up your browser automatically, if this is not the case, you can find it on your 
localhost, port: 5000.

The login for the admin application is:\
username: admin \
password: admin
