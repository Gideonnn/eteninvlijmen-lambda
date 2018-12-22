'use strict';

const aws = require('aws-sdk');

const dynamoDb = new aws.DynamoDB.DocumentClient();

module.exports.list = (event, context, callback) => {
  const { year, week } = event.pathParameters;

  const params = {
    TableName: 'eteninvlijmen-entries',
    FilterExpression: '#y = :year AND #w = :week',
    ExpressionAttributeNames: {
      '#y': 'year',
      '#w': 'week',
    },
    ExpressionAttributeValues: {
      ':year': year,
      ':week': week,
    },
  };

  dynamoDb.scan(params, (error, result) => {
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
      body: JSON.stringify(result.Items),
    });
  });
};
