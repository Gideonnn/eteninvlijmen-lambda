'use strict';

const aws = require('aws-sdk');

const dynamoDb = new aws.DynamoDB.DocumentClient();

module.exports.update = (event, context, callback) => {
  const { avatar } = JSON.parse(event.body);

  if (typeof avatar !== 'string') {
    console.error('Validation failed');

    callback(null, {
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain' },
      body: "Missing parameter 'avatar'",
    });

    return;
  }

  const params = {
    TableName: 'eteninvlijmen-users',
    Key: {
      name: event.pathParameters.name,
    },
    ExpressionAttributeValues: {
      ':avatar': avatar,
    },
    UpdateExpression: 'SET avatar = :avatar',
    ReturnValues: 'ALL_NEW',
  };

  dynamoDb.update(params, (error, result) => {
    if (error) {
      console.error(error);

      callback(null, {
        statusCode: error.statusCode || 500,
        headers: { 'Content-Type': 'text/plain' },
        body: error,
      });

      return;
    }

    callback(null, {
      statusCode: 200,
      body: JSON.stringify(result.Attributes),
    });
  });
};
