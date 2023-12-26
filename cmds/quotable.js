const axios = require('axios');

async function quotable(event, api) {
  if (event.body.toLowerCase().includes('-help')) {
    const usage = "Usage: quotable\n\n" +
      "Description: Retrieves and displays a random quote from Quotable API.";
    api.sendMessage(usage, event.threadID);
    return;
  }

  try {
    const response = await axios.get('https://api.quotable.io/random');
    const quote = response.data;

    if (quote) {
      const message = `"${quote.content}"\n\n- ${quote.author}`;
      api.sendMessage(message, event.threadID);
    } else {
      api.sendMessage('Unable to fetch a quote at the moment. Please try again later.', event.threadID);
    }
  } catch (err) {
    console.error(`Error fetching quotable quote: ${err}`);
    api.sendMessage('Failed to fetch a quote. Please try again later.', event.threadID);
  }
}

module.exports = quotable;
