'use strict';

const aws = require('aws-sdk');

const dynamoDb = new aws.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {
  const { name, avatar } = JSON.parse(event.body);

  if (typeof name !== 'string' || typeof avatar !== 'string') {
    console.error('Validation failed');

    callback(null, {
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Error parsing request body',
    });

    return;
  }

  const params = {
    TableName: 'eteninvlijmen-users',
    Item: {
      name: name,
      avatar: avatar,
    },
  };

  dynamoDb.put(params, error => {
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
      statusCode: 201,
      body: JSON.stringify(params.Item),
    });
  });
};
