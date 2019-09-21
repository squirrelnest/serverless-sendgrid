'use strict';

// dependencies
const sgMail = require('@sendgrid/mail');
const AWS = require("aws-sdk");
AWS.config.update({region: 'us-east-1'});
const sns = new AWS.SNS();
const sqs = new AWS.SQS({endpoint: 'https://sqs.us-east-1.amazonaws.com/533083114518/MyFirstQueue'});

// constants
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// lambda function calls
module.exports = {
  
  email: async (event) => {
    // const webhookData = JSON.parse(event.body);

    /**
     * here you would lookup the subject's full name and
     * email address in your user/auth provider database
     * to personalize the email
     */
    // const { subject } = webhookData.emailSubject;
    // const userInfo = await getUserInfo(subject);

    const msg = {
        to: 'halflifeheffer@gmail.com', 
        from: 'halflifeheffer@gmail.com',
        subject: 'SQS event message received',
        text: 'Holy Cow. You sent an email via sendgrid',
        // html: `<strong>New ${JSON.stringify(event.Records[0].body)} event added to DynamoDB stream for Users table</strong>`,
        html: '<strong>DynamoDB stream -> SNS -> SQS</strong>',
    };
    await sgMail.send(msg);

    return {
        statusCode: 200,
        body: 'Your function executed. Attempting to send email.'
    };
  },

  greet: async (event) => {
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: 'Go Serverless v1.0! Your function executed successfully!',
          input: event,
        },
        null,
        2
      ),
    };

    // Use this code if you don't use the http event with the LAMBDA-PROXY integration
    // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
  },

  dbNotify: async (event, context, callback) => {
    let record = event.Records[0];
    let who = JSON.stringify(record.dynamodb.NewImage.Username.S);
    let when = JSON.stringify(record.dynamodb.NewImage.Timestamp.S);
    let what = JSON.stringify(record.dynamodb.NewImage.Color.S);

    // if (record.eventName === 'INSERT') {
      // let SNSparams = {
      //     Subject: 'A new record from ' + who, 
      //     Message: 'User ' + who + ' barfed ' + what + ' on ' + when,
      //     TopicArn: 'arn:aws:sns:us-east-1:533083114518:tyvek'
      // };
      // let SQSparams = {
      //   MessageBody: 'Test Message Body',
      //   QueueUrl: 'https://sqs.us-east-1.amazonaws.com/533083114518/MyFirstQueue',
      //   MessageAttributes: {
      //     "Title": {
      //       DataType: 'String',
      //       StringValue: 'Boingo'
      //     }
      //   }
      // }

      // PUBLISH TO SNS
      // sns.publish(SNSparams, function(err, data) {
      //     if (err) {
      //         console.error("Unable to send message. Error JSON:", JSON.stringify(err, null, 2));
      //     } else {
      //         console.log("Results from sending message: ", JSON.stringify(data, null, 2));
      //     }
      // });

      // PUBLISH TO SQS
      // sqs.sendMessage(SQSparams, function(err, data) {
      //     if (err) {
      //         console.error("Unable to send message. Error JSON:", JSON.stringify(err, null, 2));
      //     } else {
      //         console.log("Results from sending message: ", JSON.stringify(data, null, 2));
      //     }
      // });
    // }

    // SEND EMAIL VIA SENDGRID
    const msg = {
      to: 'halflifeheffer@gmail.com', 
      from: 'halflifeheffer@gmail.com',
      subject: 'User Table modified',
      text: 'Holy Cow. You sent an email via sendgrid',
      html: `<strong>Notifying SNS: New ${record.eventName} event added to DynamoDB stream.</strong><p>User ${who} barfed ${what} on ${when}</p>`,
    };
    await sgMail.send(msg);

    return {
      statusCode: 200,
      body: 'Your function executed. Attempting to notify SNS.',
      input: record
    };
  }

};