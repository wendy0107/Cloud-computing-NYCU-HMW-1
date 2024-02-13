#!/bin/bash

# Update the package manager
sudo apt-get update

# Install Node.js and npm
sudo apt-get install -y nodejs npm

npm install cors
npm install express
sudo npm install --save-dev nodemon

# Verify the Node.js and npm installations
node -v
npm -v
