'use strict';

const aws = require('aws-sdk');

const dynamoDb = new aws.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {
  const { name, avatar } = JSON.parse(event.body);

  if (typeof name !== 'string') {
    console.error('Validation failed');

    callback(null, {
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Error parsing request body',
    });

    return;
  }

  const defaultAvatar =
    'https://avataaars.io/?' +
    'avatarStyle=Circle&' +
    'topType=Default&' +
    'hairColor=Default&' +
    'hatColor=Default&' +
    'accessoriesType=Default&' +
    'facialHairType=Default&' +
    'facialHairColor=Default&' +
    'clotheType=Default&' +
    'clotheColor=Default&' +
    'eyeType=Default&' +
    'eyebrowType=Default&' +
    'mouthType=Default&' +
    'skinColor=Default';

  const params = {
    TableName: 'eteninvlijmen-users',
    Item: {
      name,
      avatar: defaultAvatar,
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
      body: JSON.stringify(params.Item),
    });
  });
};
