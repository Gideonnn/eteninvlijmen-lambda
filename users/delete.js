'use strict';

const aws = require('aws-sdk');

const dynamoDb = new aws.DynamoDB.DocumentClient();

module.exports.delete = (event, context, callback) => {
  const params = {
    TableName: 'eteninvlijmen-users',
    Key: {
      name: event.pathParameters.name,
    },
  };

  dynamoDb.delete(params, error => {
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
      body: JSON.stringify({}),
    });
  });
};
