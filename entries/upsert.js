'use strict';

const aws = require('aws-sdk');

const dynamoDb = new aws.DynamoDB.DocumentClient();

module.exports.upsert = (event, context, callback) => {
  const prefs = JSON.parse(event.body);

  if (!Array.isArray(prefs) || prefs.length !== 7) {
    console.error('Validation failed');

    callback(null, {
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Error parsing request body',
    });

    return;
  }

  const { year, week, user } = event.pathParameters;
  const id = `${year},${week},${user}`;

  const params = {
    TableName: 'eteninvlijmen-entries',
    Key: {
      id,
    },
    Item: {
      id,
      year,
      week,
      user,
      prefs,
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
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params.Item.prefs),
    });
  });
};
