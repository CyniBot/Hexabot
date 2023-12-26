const axios = require('axios');

async function hercai(event, api) {
  const input = event.body.toLowerCase().split(' ');

  if (input.includes('-help')) {
    const usage = "Usage: hercai [question]\n\n" +
      "Description: Gets a response from Hercai API based on the provided question.\n\n" +
      "Example: hercai How does this work?";
    api.sendMessage(usage, event.threadID);
    return;
  }

  const question = input.slice(1).join(' ');

  try {
    const response = await axios.get(`https://hercai.onrender.com/v3-beta/hercai?question=${encodeURIComponent(question)}`);
    const hercaiResponse = response.data;

    if (hercaiResponse && hercaiResponse.reply) {
      api.sendMessage(hercaiResponse.reply, event.threadID);
    } else {
      api.sendMessage('Unable to get a response from Hercai at the moment. Please try again later.', event.threadID);
    }
  } catch (err) {
    console.error(`Error fetching Hercai response: ${err}`);
    api.sendMessage('Failed to get a response from Hercai. Please try again later.', event.threadID);
  }
}

module.exports = hercai;
