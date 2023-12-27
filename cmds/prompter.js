const axios = require('axios');

async function prompter(event, api) {
  const input = event.body.toLowerCase().split(' ');

  if (input.includes('-help')) {
    const usage = "Usage: prompter [partial_prompt]\n\n" +
      "Description: Auto-completes a prompt using the Celestial Dainsleif Prompter API.\n\n" +
      "Example: prompter medieval city";
    api.sendMessage(usage, event.threadID);
    return;
  }

  const partialPrompt = input.slice(1).join(' ');

  try {
    const response = await axios.get(`https://celestial-dainsleif-docs.archashura.repl.co/prompter?prompt=${encodeURIComponent(partialPrompt)}`);
    const prompterResponse = response.data;

    if (prompterResponse && prompterResponse.generated_text) {
      api.sendMessage(prompterResponse.generated_text, event.threadID);
    } else {
      api.sendMessage('Unable to generate prompt at the moment. Please try again later.', event.threadID);
    }
  } catch (err) {
    console.error(`Error generating prompt: ${err}`);
    api.sendMessage('Failed to generate prompt. Please try again later.', event.threadID);
  }
}

module.exports = prompter;
