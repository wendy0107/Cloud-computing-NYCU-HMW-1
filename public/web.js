const fileInput = document.getElementById("fileInput");
const uploadButton = document.getElementById("uploadButton");
const fileListMetadata = document.getElementById("fileListMetadata");
const fileNum = document.getElementById("fileNum");
const listButton = document.getElementById("listButton");

const apiURL = 'http://192.168.33.11:8080';

// handle upload
uploadButton.addEventListener('click', () => {
  const files = fileInput.files;
  if (files.length === 0) {
    alert('No files selected for upload.');
    return;
  } else {
  console.log("not empty");

const formData = new FormData();

for (let i = 0; i < files.length; i++) {
  console.log("filename is : " + files[i].name)
  console.log(typeof files[i]);
  formData.append('file', files[i]);
}

console.log(formData.getAll("file"));

  fetch('http://192.168.33.11:8080/upload', {
  method: 'POST',
  body: formData,
  mode: "cors"
})
  .then(response => response.json())
  .then(data => {
    console.log('Frontend Upload successful:', data);

    renderFilesMetadata(files);
    console.log("Rendered files data");
  })
  .catch(error => {
    console.error('Frontend Upload failed:', error);
  });
  }
});

listButton.addEventListener('click', async function() { listFiles(); });

async function listFiles() {
  console.log("list files clicked");
  await fetch('http://192.168.33.11:8080/list')
  .then(response => response.json())
  .then(data => {
    const files = data.files;
    const HTMLFileList = document.getElementById("fileList");
    HTMLFileList.innerHTML = "" // clear content


    files.forEach(file => {
      console.log(file);
      console.log(file.originalname);
      const listItem = document.createElement('li');

      const filenameElement = document.createElement('span');
      filenameElement.innerHTML = `Filename: <strong>${file.name}</strong> `;

      const fileSizeElement = document.createElement('span');
      fileSizeElement.innerHTML = `File Size: <strong>${Math.ceil(file.size / 1000)} bytes</strong> `;
      // set class name for file size element and align right

      const downloadButton = document.createElement("a");
      downloadButton.className = "download-button";
      downloadButton.download = file.name;
      downloadButton.textContent = "Download";

      downloadButton.addEventListener("click", async function() {
        console.log(`frontend from list files ${generatePreSignedURL(file.name)}`);
        const url = await generatePreSignedURL(file.name);
        downloadButton.href = url;
        console.log(`download button href ${downloadButton.href}`);
        try {
          // const response = fetch(url);
          // const blob = (await response).blob();
          const a = document.createElement("a");
          a.href = url;
          a.download = file.name;
          a.style.display = "none";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        } catch (error) {
          console.error("Error while preparing download:", error);
        }
      });

      listItem.appendChild(filenameElement);
      listItem.appendChild(fileSizeElement);
      listItem.appendChild(downloadButton);

      HTMLFileList.appendChild(listItem);
    });
  })
  .catch((error) => {
    console.error(`Error in list files frontend`);
    throw error; // Re-throw the error to propagate it further if needed
  });
}

// Function to generate a pre-signed URL
async function generatePreSignedURL(fileName) {
  console.log("generate presigned URL called");
  return await fetch(`http://192.168.33.11:8080/getPresignedURL?fileName=${fileName}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      const presignedUrl = data.presignedUrl;
      console.log(`Presigned URL received in frontend: ${presignedUrl}`);
      return presignedUrl;
    })
    .catch((error) => {
      console.error(`Error getting pre-signed URL for file ${fileName}`, error);
      throw error; // Re-throw the error to propagate it further if needed
    });
}


// function downloadFileFromPresignedURL(presignedUrl) {
//   console.log(`download file presignedurl called ${presignedUrl}`);
//   const downloadLink = document.createElement("a"); // invisible download button
//   downloadLink.style.display = "none";
//   downloadLink.href = presignedUrl;
//   downloadLink.target = '_self';
//   document.body.appendChild(downloadLink);
//   downloadLink.click();
//   document.body.removeChild(downloadLink);
// }

// function generatePreSignedURL(fileName) {
//   console.log("generate presignedurl called");
//   fetch(`http://192.168.33.11:8080/getPresignedURL?fileName=${fileName}`)
//   .then((response) => response.json())
//   .then((response) => console.log(response.json()))
//   .then((data) => {
//     const presignedUrl = data.presignedUrl;
//     console.log(presignedUrl);
//     downloadFileFromPresignedURL(fileName, presignedUrl);
//   })
//   .catch((error) => {
//     console.error("Error getting pre-signed URL for file ${fileName}", error);
//   });
// }


function renderFilesMetadata(fileList) {
  fileNum.textContent = (parseInt(fileNum.textContent) + fileList.length).toString();

  for (const file of fileList) {
    const name = file.name;
    const type = file.type;
    const size = file.size;
    console.log(`name from renderfilesmetadata${name}`)

    const listItem = document.createElement('il');

    // const downloadButton = document.createElement("a");
    // downloadButton.className = "download-button";
    // downloadButton.download = name;
    // downloadButton.textContent = "Download";
    // // downloadButton.target = '_self';

    // downloadButton.addEventListener("click", function () {
    //   console.log(`frontend from renderfile ${generatePreSignedURL(name)}`);
    //   console.log(`download button href ${downloadButton.href}`);
    //   downloadButton.href = generatePreSignedURL(name);
    // });

    const fileDetails = document.createElement("p");
    fileDetails.innerHTML = `Name: <strong> ${name} </strong> Type: <strong> ${type} </strong>
    Size: <strong> ${Math.ceil(size / 1000)} bytes</strong>`;

    listItem.appendChild(fileDetails);
    // listItem.appendChild(downloadButton);

    fileListMetadata.appendChild(listItem);
  }
  console.log("after rendering metadata loop")
}
