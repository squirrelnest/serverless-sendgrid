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
        to: 'halflifeheffer@gmail.com', // user's email here
        from: 'halflifeheffer@gmail.com', // your company's email here
        subject: 'Mooo!',
        text: 'Holy Cow. You sent an email via sendgrid',
        html: '<strong>Serverless is easy to do anywhere, even with Node.js</strong>',
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
    // console.log(event)
    // event.Records.forEach( record => {
    //   console.log('Stream record: ', JSON.stringify(record, null, 2));
    //   if (record.eventName === 'INSERT') {
    //     var who = JSON.stringify(record.dynamodb.NewImage.Username.S);
    //     var when = JSON.stringify(record.dynamodb.NewImage.Timestamp.S);
    //     var what = JSON.stringify(record.dynamodb.NewImage.Message.S);
    //     var params = {
    //         Subject: 'A new bark from ' + who, 
    //         Message: 'Woofer user ' + who + ' barked the following at ' + when + ':\n\n ' + what,
    //         TopicArn: 'arn:aws:sns:us-east-1:533083114518:tyvek'
    //     };
    //     sns.publish(params, function(err, data) {
    //         if (err) {
    //             console.error("Unable to send message. Error JSON:", JSON.stringify(err, null, 2));
    //         } else {
    //             console.log("Results from sending message: ", JSON.stringify(data, null, 2));
    //         }
    //     });
    //   }
    // })
    const msg = {
      to: 'halflifeheffer@gmail.com', // user's email here
      from: 'halflifeheffer@gmail.com', // your company's email here
      subject: 'User Table modified',
      text: 'Holy Cow. You sent an email via sendgrid',
      html: '<strong>New event added to DynamoDB stream for Users table</strong>',
    };
    await sgMail.send(msg);
    // callback(null, `Successfully processed ${event.Records.length} records.`);
    return {
      statusCode: 200,
      body: 'Your function executed. Attempting to send email.',
      // input: event
    };
  }

};