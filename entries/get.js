'use strict';

const aws = require('aws-sdk');

const dynamoDb = new aws.DynamoDB.DocumentClient();

module.exports.get = (event, context, callback) => {
  const { year, week, user } = event.pathParameters;
  const id = `${year},${week},${user}`;

  const params = {
    TableName: 'eteninvlijmen-entries',
    Key: {
      id,
    },
  };

  dynamoDb.get(params, (error, result) => {
    if (error) {
      console.error(error);

      callback(null, {
        statusCode: error.statusCode || 500,
        headers: { 'Content-Type': 'text/plain' },
        body: error,
      });

      return;
    }

    const response = result.Item
      ? result.Item.prefs
      : [false, false, false, false, false, false, false];

    callback(null, {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(response),
    });
  });
};
