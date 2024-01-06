const axios = require('axios');

async function ai(event, api) {
  const input = event.body.toLowerCase().split(' ');

  if (input.includes('-help')) {
    const usage = "Usage: ai [question]\n\n" +
      "Description: Gets an AI-generated response using Hercai API based on the provided question.\n\n" +
      "Example: ai How does artificial intelligence work?";
    api.sendMessage(usage, event.threadID);
    return;
  }

  const question = input.slice(1).join(' ');

  try {
    const response = await axios.get(`https://hercai.onrender.com/v3-beta/hercai?question=${encodeURIComponent(question)}`);
    const aiResponse = response.data;

    if (aiResponse && aiResponse.reply) {
      api.sendMessage(aiResponse.reply, event.threadID);
    } else {
      api.sendMessage('Unable to get an AI-generated response at the moment. Please try again later.', event.threadID);
    }
  } catch (err) {
    console.error(`Error fetching AI response: ${err}`);
    api.sendMessage('Failed to get an AI-generated response. Please try again later.', event.threadID);
  }
}

module.exports = ai;
