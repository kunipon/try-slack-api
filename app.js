const { WebClient } = require('@slack/web-api');

const client = new WebClient(process.env.SLACK_TOKEN);

const calculateEpochSeconds = (year, month, day) => {
  const epochMilli = new Date(year, month-1, day).getTime();
  return epochMilli/1000;
};

const isTarget = (message) => {
  const hasAttachments = message.hasOwnProperty('attachments');
  const isTargetUser = message.user === process.env.USER_ID;
  return hasAttachments && isTargetUser;
};

const options = {
  channel: process.env.CHANNEL_ID,
  limit: 1,
  oldest: calculateEpochSeconds(2019, 4, 1),
  latest: calculateEpochSeconds(2019, 5, 1),
};

(async () => {
  const pageIterator = client.paginate('conversations.history', options);

  try {
    for await (const page of pageIterator) {
      for await (const message of page.messages) {
        if (isTarget(message)) {
          console.log(message.attachments[0].text);//.split('\n')[1]);
        }
      }
    }
  } catch(e) {
    console.log(e)
  }
})();