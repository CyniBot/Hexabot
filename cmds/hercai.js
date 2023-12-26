const axios = require('axios');

async function hercai(event, api) {
  const input = event.body.toLowerCase().trim();

  if (input.includes('-help')) {
    const usage = "Usage: hercai [question]\n\n" +
      "Description: Retrieves a response from the Hercai API based on the provided question.\n\n" +
      "Example: hercai What is the meaning of life?";
    api.sendMessage(usage, event.threadID);
    return;
  }

  const question = encodeURIComponent(input.slice(7));

  try {
    const apiUrl = `https://hercai.onrender.com/v3-beta/hercai?question=${question}`;
    const response = await axios.get(apiUrl);
    const answer = response.data;

    if (answer) {
      api.sendMessage(answer, event.threadID);
    } else {
      api.sendMessage('Unable to fetch a response from Hercai API at the moment. Please try again later.', event.threadID);
    }
  } catch (err) {
    console.error(`Error fetching response from Hercai API: ${err}`);
    api.sendMessage('Failed to fetch a response. Please try again later.', event.threadID);
  }
}

module.exports = hercai;
