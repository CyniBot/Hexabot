const axios = require('axios');

async function gemini(event, api) {
  const input = event.body.toLowerCase().split(' ');

  if (input.includes('-help')) {
    const usage = "Usage: gemini [question]\n\n" +
      "Description: Gets a response from Gemini API based on the provided question.\n\n" +
      "Example: gemini How can I get started?";
    api.sendMessage(usage, event.threadID);
    return;
  }

  const question = input.slice(1).join(' ');

  try {
    const response = await axios.get(`https://hercai.onrender.com/gemini/hercai?question=${encodeURIComponent(question)}`);
    const geminiResponse = response.data;

    if (geminiResponse && geminiResponse.reply) {
      api.sendMessage(geminiResponse.reply, event.threadID);
    } else {
      api.sendMessage('Unable to get a response from Gemini at the moment. Please try again later.', event.threadID);
    }
  } catch (err) {
    console.error(`Error fetching Gemini response: ${err}`);
    api.sendMessage('Failed to get a response from Gemini. Please try again later.', event.threadID);
  }
}

module.exports = gemini;
