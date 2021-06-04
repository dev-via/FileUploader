const fs = require("fs");
const baseUrl = "http://localhost:3000/files/";
const fetch = require('node-fetch');

const getListFiles = (req, res) => {
   const directoryPath = __basedir + "/public/uploads/";

   fs.readdir(directoryPath, function (err, files) {
      if (err) {
         res.status(500).send({
            message: "Unable to scan files!",
         });
      }

      let fileInfos = [];

      files.forEach((file) => {
         fileInfos.push({
            name: file,
            url: baseUrl + file,
         });
      });
      console.log(fileInfos)
      res.status(200).json(fileInfos);
   });
};

const download = (req, res) => {
   const fileName = req.params.name;
   const directoryPath = __basedir + "/public/uploads/";

   res.download(directoryPath + fileName, fileName, (err) => {
      if (err) {
         res.status(500).send({
            message: "Could not download the file. " + err,
         });
      }
   });
};

module.exports = {
   getListFiles,
   download,
};
