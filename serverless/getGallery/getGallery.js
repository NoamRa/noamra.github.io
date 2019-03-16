const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = "noamr-web-gallery";

exports.handler = function(event, context, callback) {
  console.log(event);
  const qParms = event.queryStringParameters;

  if (qParms && qParms.collectionId) { // query collectionId
    console.log("requested collectionId:", qParms.collectionId);
    const queryParams = {
      TableName: TABLE_NAME,
      KeyConditionExpression: "#colId = :collectionId",
      ExpressionAttributeNames: {
        "#colId": "collectionId",
      },
      ExpressionAttributeValues: {
        ":collectionId": qParms.collectionId,
      },
    };
    docClient.query(queryParams, (err, data) => {
      if (err) {
        console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        callback(err);
      }
      else {
        console.log("query data:", data);
        callback(null, data);
      }
    });
  }

  else { // scan table
    console.log("requested all assets");
    const scanParams = {
      TableName: TABLE_NAME,
      Limit: 300,
    };
    docClient.scan(scanParams, (err, data) => {
      if (err) {
        console.error("Unable to scan. Error:", JSON.stringify(err, null, 2));
        callback(err);
      }
      else {
        console.log("scan data:", data);
        callback(null, data);
      }
    });
  }
};