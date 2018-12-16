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

    callback(null, {
      statusCode: 200,
      body: JSON.stringify(result.Item.prefs),
    });
  });
};