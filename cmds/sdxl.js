const axios = require('axios');

async function sdxl(event, api) {
  const { body, threadID, messageID } = event;
  const args = body.split(' ');
  const text = args.join(' ');

  if (args.includes('-help')) {
    const usage = "Usage: sdxl [prompt|model]\n\n" +
      "Description: Generates text using the SDXL models.\n\n" +
      "Example: sdxl Once upon a time|DreamshaperXL10\n\n" +
      "Models:\n" +
      "1 | DreamshaperXL10\n" +
      "2 | DynavisionXL\n" +
      "3 | JuggernautXL\n" +
      "4 | RealismEngineSDXL\n" +
      "5 | Sdxl 1.0";
    api.sendMessage(usage, threadID);
    return;
  }

  if (!text) {
    return api.sendMessage("😡 Please provide a prompt with models", threadID, messageID);
  }

  const [prompt, model] = text.split('|').map((text) => text.trim());
  const selectedModel = model || "2";
  const baseURL = `https://sandipapi.onrender.com/sdxl?prompt=${encodeURIComponent(prompt)}&model=${selectedModel}`;
  api.setMessageReaction("⏳", messageID, () => {}, true);

  try {
    const response = await axios.get(baseURL, { maxRedirects: 0 });
    const imageUrl = response.headers.location;

    // Add code to send imageUrl as an attachment
    const message = {
      body: '✅ Generated Image:',
      attachment: axios.get(imageUrl, { responseType: 'stream' }).data,
    };
    api.sendMessage(message, threadID, messageID);

    api.setMessageReaction("✅", messageID, () => {}, true);
  } catch (error) {
    console.error('Error:', error.message);
    api.sendMessage('An error occurred while generating text. Please try again later.', threadID, messageID);
  }
}

module.exports = sdxl;
