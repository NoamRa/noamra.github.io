const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const gm = require("gm").subClass({ imageMagick: true });
const rekognition = new AWS.Rekognition();
const docClient = new AWS.DynamoDB.DocumentClient();

const MAX_LABELS = 20;
const MIN_CONFIDENCE = 80;
const DYNAMO_TABLE_NAME = "noamr-web-gallery";

let lambdaCallback, bucket, srcKey;
let tableRecord = {};

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

const getCreationDate = (exif) => {
  if (exif["exif:DateTimeOriginal"]) {
    return exif["exif:DateTimeOriginal"];
  } 
  else if (exif["exif:DateTimeDigitized"]) {
    return exif["exif:DateTimeDigitized"];
  }
};

const getImageMetadata = (buffer) => {
  return new Promise((resolve, reject) => {
    gm(buffer)
    .identify((err, data) => {
      if (!err && data && typeof data === "object") {
        let properties = {};
        Object.entries(data.Properties).forEach(([key, value]) => {
          if (key.includes(":")) {
            const splt = key.split(":");
            const major = splt[0];
            const minor = splt[1];
            if (!properties[major]) {
              properties[major] = {};
            }
            properties[major][minor] = value;
          } 
          else {
            properties[key] = value;
          }
        });
        const metadata = { 
          width: data.size.width,
          height: data.size.height,
          created: getCreationDate(data.Properties),
          properties,
        };
        console.log(`metadata - width: ${metadata.width}, height: ${metadata.height}, created: ${metadata.created}`);
        resolve(metadata);
      }
      else {
        console.log("getImageMetadata had error", err);
        reject({error: err});
      }
    });
  });
};

const addRekognitionToRecord = (rekognitionData) => {
  const labels = rekognitionData.Labels.map(lbl => lbl.Name);
  tableRecord.labels = labels;
};

const addToDataTable = () => {
  // get table's primary key (collectionId) and sort key (assetId).
  const splitedKey = srcKey.split("/");
  const collectionId = splitedKey.length === 2 ? "misc" : splitedKey[1];
  const assetId = splitedKey[splitedKey.length-1];
  
  tableRecord.collectionId = collectionId;
  tableRecord.assetId = assetId;
  tableRecord.assetBucket = bucket;
  tableRecord.assetKey = srcKey;
  
  const params = {
    TableName: DYNAMO_TABLE_NAME,
    Item: tableRecord
  };

  console.log("params:", params);

  return docClient.put(params).promise();
};

exports.handler = function(event, context, callback) {
  lambdaCallback = callback;
  bucket = event.Records[0].s3.bucket.name;
  srcKey = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));
  
  rekognizeLabels()
  .then(data => {
    addRekognitionToRecord(data);
  })
  .then(() => {
    const s3Location = {
      Bucket: bucket,
      Key: srcKey
    };
    return s3.getObject(s3Location).promise();
  })
  .then((resp) => {
    const metadata = getImageMetadata(resp.Body);   
    return metadata;
  })
  .then((metadata) => {
    tableRecord = { ...tableRecord, ...metadata };
    return tableRecord;
  })
  .then(() => {
    addToDataTable();
  })
  .then((resp) => {
    console.log(`Data added to ${DYNAMO_TABLE_NAME} Table`);
    lambdaCallback(null, resp);
  })
  .catch((err) => {
    lambdaCallback(err, null);
  });
};