#!/usr/bin/env bash
sudo apt update && sudo apt install nodejs npm
#Install PM2 which is a production process manager for Node.js with a built-in load balancer.
sudo npm install -g pm2
#Stop any instance of our application running currently
pm2 stop example_app
pm2 delete example_app
#CD into folder where application is downloaded
cd ProjectDevOps/
#Install application dependencies
npm install
echo $PRIVATE_KEY > privatekey.pem
echo $SERVER > server.crt
#Start the application with the process name example_app using PM2
pm2 start node_modules/react-scripts/scripts/start.js --name example_app