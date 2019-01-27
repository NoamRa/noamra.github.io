const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const gm = require("gm").subClass({ imageMagick: true });
const path = require("path");
const uuidv4 = require('uuid/v4');

const getMetadata = (img) => {
  let meta = {};
  gm(img)
  .size(function (err, size) {
  if (!err)
    meta.height = size.height;
    meta.width = size.width;
  });
};

exports.handler = (event, context, callback) => {

  const payload = JSON.parse(event.body);
  const encodedImage = payload.assetData;
  const decodedImage = Buffer.from(encodedImage, 'base64');
  const filePath = "items/" + `${uuidv4()}_${payload.assetName}`;
  const params = {
    Body: decodedImage,
    Bucket: "noamr-web-gallery",
    Key: filePath,
    ACL: "public-read",
  };
  const tags = payload.tags || [];

  const fileExtension = path.extname(payload.assetName);
  console.log("file extension:", fileExtension);
  // if (fileExtension.toLowerCase().includes([".jpg", ".png"])) {
  //   const metadata = getMetadata(decodedImage);
  //   console.log("metadata:\n", metadata);
  // }

  s3.upload(params, function(err, data) {
    if (err) {
      callback(err, null);
    } else {
      const response = {
        "statusCode": 200,
        "body": JSON.stringify(data),
        "isBase64Encoded": false,
        "headers": {
          "my_header": "my_value"
        },
      };
      callback(null, response);
    }
  });
};