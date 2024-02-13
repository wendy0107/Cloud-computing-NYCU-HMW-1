const http = require('http')
const cors = require('cors')
const express = require('express');
const app = express();

const HOSTNAME = "192.168.33.10";
const PORT = 8080;

app.use(cors())

app.use(express.static("public"));

app.get('/', (req, res) => {
    res.sendFile('index.html', {root: __dirname + '/public'});
});

app.listen(PORT, HOSTNAME, () => {
    console.log("Server is running on ", "http://" + HOSTNAME + ":" + PORT + '/');
})