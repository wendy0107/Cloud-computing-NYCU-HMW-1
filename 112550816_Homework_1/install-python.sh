#!/bin/bash

# Update the package manager
sudo apt-get update

# Install Node.js and npm
# sudo apt-get install -y nodejs npm

nvm install 16
git clone https://github.com/minio/minio-js
cd minio-js

npm install
npm install -g

npm install cors
npm install express
npm install --save multer
sudo npm install --save-dev nodemon
npm install --save minio

# Verify the Node.js and npm installations
node -v
npm -v

curl https://dl.min.io/client/mc/release/linux-arm64/mc \
  --create-dirs \
  -o ~/minio-binaries/mc

chmod +x $HOME/minio-binaries/mc
export PATH=$PATH:$HOME/minio-binaries/

# mc alias set myminio https://minioserver.example.net ACCESS_KEY SECRET KEY

# mc --help