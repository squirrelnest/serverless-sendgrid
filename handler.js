'use strict';

// module.exports.hello = async event => {
//   return {
//     statusCode: 200,
//     body: JSON.stringify(
//       {
//         message: 'Go Serverless v1.0! Your function executed successfully!',
//         input: event,
//       },
//       null,
//       2
//     ),
//   };

  // // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
// };


const sgMail = require('@sendgrid/mail');

// constants
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// lambda function call
module.exports.email = async (event) => {
    // const webhookData = JSON.parse(event.body);

    /**
     * here you would lookup the subject's full name and
     * email address in your user/auth provider database
     * to personalize the email
     */
    // const { subject } = webhookData.earnedAchievement;
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
};