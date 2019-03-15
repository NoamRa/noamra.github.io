const AWS = require("aws-sdk");
const rekognition = new AWS.Rekognition();
const docClient = new AWS.DynamoDB.DocumentClient();

const MAX_LABELS = 7;
const MIN_CONFIDENCE = 80;
const DYNAMO_TABLE_NAME = "noamr-web-gallery";
const S3Prefix = "https://s3.amazonaws.com/";

let lambdaCallback, bucket, srcKey;

const constructUrlFromS3 = (bucket, key) => (
  `${S3Prefix}${bucket}/${key}`
);

const resolveThumbUrl = (url, bucketName) => (
  url.replace(bucketName, `${bucketName}-thumb`)
);

const rekognizeLabels = () => {
  const params = {
    Image: {
      S3Object: {
        Bucket: bucket,
        Name: srcKey
      }
    },
    MaxLabels: MAX_LABELS,
    MinConfidence: MIN_CONFIDENCE,
  };

  return rekognition.detectLabels(params).promise();
};

const addToDataTable = (data) => {
  console.log("raw data:", data);
  console.log("bucket:", bucket);
  console.log("srcKey:", srcKey);

  const imageId = srcKey.split("/").pop();
  const assetLink = constructUrlFromS3(bucket, srcKey);
  const thumbLink = resolveThumbUrl(assetLink, bucket);
  const labels = data.Labels.map(lbl => lbl.Name);
  
  const params = {
    TableName: DYNAMO_TABLE_NAME,
    Item: {
      imageId,
      assetLink,
      thumbLink,
      labels,
    }
  };

  console.log("params:", params);

  return docClient.put(params).promise();
};

exports.handler = function(event, context, callback) {
  lambdaCallback = callback;
  bucket = event.Records[0].s3.bucket.name;
  srcKey = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));
  
  rekognizeLabels()
  .then((data) => {
    addToDataTable(data);
  })
  .then((resp) => {
    console.log(`Data added to ${DYNAMO_TABLE_NAME} Table`);
    lambdaCallback(null, resp);
  })
  .catch((err) => {
    lambdaCallback(err, null);
  });
};

