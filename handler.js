'use strict';

// dependencies
const sgMail = require('@sendgrid/mail');
const AWS = require("aws-sdk");
const sns = new AWS.SNS();

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
    let record = event.Records[0]
    // event.Records.forEach( record => {
    if (record.eventName === 'INSERT') {
      let who = JSON.stringify(record.dynamodb.NewImage.Username.S);
      let when = JSON.stringify(record.dynamodb.NewImage.Timestamp.S);
      let what = JSON.stringify(record.dynamodb.NewImage.Color.S);
      let params = {
          Subject: 'A new record from ' + who, 
          Message: 'User ' + who + ' barfed ' + what + ' on ' + when,
          TopicArn: 'arn:aws:sns:us-east-1:533083114518:tyvek'
      };

      // PUBLISH TO SNS
      sns.publish(params, function(err, data) {
          if (err) {
              console.error("Unable to send message. Error JSON:", JSON.stringify(err, null, 2));
          } else {
              console.log("Results from sending message: ", JSON.stringify(data, null, 2));
          }
      });


    }
    // })

    const msg = {
      to: 'halflifeheffer@gmail.com', 
      from: 'halflifeheffer@gmail.com',
      subject: 'User Table modified',
      text: 'Holy Cow. You sent an email via sendgrid',
      html: `<strong>Notifying SNS: New ${event.Records[0].eventName} event added to DynamoDB stream for Users table</strong>`,
    };
    await sgMail.send(msg);

    return {
      statusCode: 200,
      body: 'Your function executed. Attempting to notify SNS.',
      input: record
    };
  }

};