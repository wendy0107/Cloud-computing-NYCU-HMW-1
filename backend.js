const express = require('express');
const minio = require('minio');
const multer = require("multer");
const cors = require("cors");
const app = express();
const port = 8080;

const storage = multer.memoryStorage();
const upload = multer({ storage : storage });

const minioClient = new minio.Client({
  endPoint: '192.168.33.12',
  port: 9000,
  useSSL: false,
  accessKey: 'KJ1Ij9wXFiJsOrI8CV9z',
  secretKey: 'mpgV4FK71zWGGM7WdFX35lrr2dvW9NrRjKPWBuDO',
})

// Serve static files from the 'uploads' directory
app.use(express.static('uploads'));

app.use(cors())

// Define a route for handling file uploads
app.post('/upload', upload.array("file"), (req, res) => {
  const uploadedFiles = req.files;

  if (!uploadedFiles || uploadedFiles.length === 0) {
    return res.status(400).json({ message: "No files uploaded." });
  }

  // An array to store the promises for uploading files
  const uploadPromises = [];

  for (const file of uploadedFiles) {
    const fileName = file.originalname;
    const uploadPromise = new Promise((resolve, reject) => {
      minioClient.putObject('myfiles', fileName, file.buffer, (err, objInfo) => {
        if (err) {
          console.error('Error generating pre-signed URL:', err);
          reject(err);
        } else {
          resolve(objInfo);
        }
      });
    });

    uploadPromises.push(uploadPromise);
  }

  // Wait for all promises to resolve before responding
  Promise.all(uploadPromises)
    .then(() => {
      res.json({ message: "Files uploaded and processed successfully" });
    })
    .catch((err) => {
      console.error("Error handling file upload:", err);
      res.status(500).json({ message: "Internal Server Error" });
    });
});
// app.post('/upload', upload.array("file"), (req, res) => {
//   // Here, 'files' is the field name from the HTML form
//   try {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     console.log("app post called");
//     // Handle uploaded files
//     const uploadedFiles = req.files;

//     if (!uploadedFiles) {
//       console.log("Error no uploaded files");
//     }

//     uploadedFiles.forEach(file => {
//       var fileName = file.originalname;
//       console.log(fileName);
//       console.log(file.size);

//       minioClient.putObject('myfiles', fileName, file.buffer, (err, objInfo) => {
//         if (err) {
//           console.error('Error uploading file', err);
//           return;
//         }
//       });
//       res.json({message: "Successfully uplaoded to minio in backend ", objInfo});
//     });

//     // Send a response
//     // res.send("Backend: Files uploaded and processed successfully")
//   } catch (err) {
//     console.log("Backend: Error handling file upload", err);
//     res.status(500).json( {message: "Backend: Error handling file upload"} );
//   }
// });

app.get('/getPresignedURL', (req, res) => {
  console.log("gets called");

  const filename = req.query.fileName;

  minioClient.presignedGetObject('myfiles', filename, (err, presignedUrl) => {
    if (err) {
      console.error("Error generating pre-signed URL: ", err);
      res.status(500).json({error: "Error generating pre-signed ULR"});
    } else {
      console.log("success presignedurl backend");
      console.log("generated url: ", presignedUrl);
      res.json({presignedUrl});
    }
  });
});

app.get('/list', (req, res) => {
  console.log("list called from backend");
  const file_list = []
  
  minioClient.listObjects('myfiles', '', true)
  .on('data', (obj) => {
    // Append the file name to the list
    file_list.push(obj);
  })
  .on('error', (err) => {
    console.error("Error listing files: ", err);
    res.status(500).send(err);
  })
  .on('end', () => {
    res.json({files: file_list});
  });
});

// Start the server
const server = app.listen(port, () => {
  console.log(`Server is running on http://192.168.33.11:${port}`);
});

server.on('error', error => {
  console.error('Server error:,', error);
});
