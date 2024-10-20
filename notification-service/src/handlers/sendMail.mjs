import AWS from 'aws-sdk';
import logger from '../libs/logger.mjs';

const ses = new AWS.SES({ region: process.env.AWS_PROVIDER_REGION });

const sendMail = async (event) => {
  const record = event.Records[0];
  const { subject, body, recipient } = JSON.parse(record.body);

  const params = {
    Source: process.env.SEND_EMAIL_SOURCE,
    Destination: {
      ToAddresses: [recipient],
    },
    Message: {
      Body: { Text: { Data: body } },
      Subject: { Data: subject },
    },
  };

  try {
    return await ses.sendEmail(params).promise();
  } catch (error) {
    logger.error(error, 'Email sending failed');
  }
};

export default sendMail;
