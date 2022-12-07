const fs = require("fs");
const baseUrl = "https://file-uploader-1fob.onrender.com/files/"
const fetch = require('node-fetch');

// Shows list of files
const getFiles = (req, res) => {
  const directoryPath = __basedir + "/public/uploads/"

  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      res.status(500).send({
        message: "Unable to scan files!",
      })
    }
    let fileInfo = []

    files.forEach((file) => {
      fileInfo.push({
        filename: file,
        url: baseUrl + file,
      })
    })
    res.render('downloaded-files', {
      fileInfo: fileInfo
    })
  })
}

// Delete file
const deleteFile = (req, res) => {
  const directoryPath = __basedir + '/public/uploads/'
  const filename = req.params.name

  fs.rm(directoryPath + filename, (err, files) => {
    if (err) console.error(err)

    res.redirect('/files')
  })
}

// Download file
const download = (req, res) => {
  const fileName = req.params.name
  const directoryPath = __basedir + '/public/uploads/'

  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not download the file. " + err,
      })
    }
  })
}

module.exports = {
  getFiles,
  download,
  deleteFile
}
