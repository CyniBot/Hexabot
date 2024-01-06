const axios = require('axios');
const tinyurl = require('tinyurl');

async function sauce({ message, args, event, api }) {
  let imageUrl;

  if (event.type === 'message_reply') {
    const replyAttachment = event.messageReply.attachments[0];

    if (['photo', 'sticker'].includes(replyAttachment?.type)) {
      imageUrl = replyAttachment.url;
    } else {
      return api.sendMessage({ body: '❌ | Reply must be an image.' }, event.threadID);
    }
  } else if (args[0]?.match(/(https?:\/\/.*\.(?:png|jpg|jpeg))/g)) {
    imageUrl = args[0];
  } else {
    return api.sendMessage({ body: '❌ | Reply to an image.' }, event.threadID);
  }

  const url = await tinyurl.shorten(imageUrl);
  const replyMessage = await message.reply('Please wait...⏳');

  try {
    const response = await axios.get(`https://turtle-apis.onrender.com/api/sauce?url=${url}`);
    const result = response.data.result;
    const videoUrl = result.video;
    const title = result.title;
    const similarity = result.similarity;

    message.reply({
      body: `Video URL: ${videoUrl}\nName: ${title}\nSimilarity: ${similarity}`,
    });
  } catch (err) {
    message.unsend(replyMessage);
    message.reply(err.message);
    console.error(err);
  }
}

module.exports = sauce;
