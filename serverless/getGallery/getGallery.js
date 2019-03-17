const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = "noamr-web-gallery";

const buildResponse = (data) => {
    return {
        statusCode: "200",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Origin": "*"
        }
    };
};

exports.handler = (event, context, callback) => {
  // console.log(event);
  if (event.httpMethod !== "GET"){
    callback("Only GET method is supported");
  }

  const pathParms = event.pathParameters;

  if (pathParms && pathParms.collectionId) { // query collectionId
    console.log("requested collectionId:", pathParms.collectionId);
    const queryParams = {
      TableName: TABLE_NAME,
      KeyConditionExpression: "#colId = :collectionId",
      ExpressionAttributeNames: {
        "#colId": "collectionId",
      },
      ExpressionAttributeValues: {
        ":collectionId": pathParms.collectionId,
      },
    };
    docClient.query(queryParams, (err, data) => {
      if (err) {
        callback(err);
      }
      else {
        console.log("query data:", data);
        callback(null, buildResponse(data));
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
        callback(err);
      }
      else {
        console.log("scan data:", data);
        callback(null, buildResponse(data));
      }
    });
  }
};