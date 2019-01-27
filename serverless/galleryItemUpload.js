const AWS = require('aws-sdk');
let s3 = new AWS.S3();

exports.handler = (event, context, callback) => {

  const payload = JSON.parse(event.body);
  const encodedImage = payload.assetData;
  const decodedImage = Buffer.from(encodedImage, 'base64');
  const filePath = "items/" + payload.assetName;
  const tags = payload.tags || [];
  const params = {
    "Body": decodedImage,
    "Bucket": "noamr-web-gallery",
    "Key": filePath,
  };

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