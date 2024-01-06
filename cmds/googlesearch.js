const axios = require('axios');

async function googlesearch(event, api) {
  const input = event.body.split(' ');
  const query = input.slice(1).join(' ');

  if (input.includes('-help')) {
    const usage = "Usage: googlesearch [query]\n\n" +
      "Description: Performs a Google search and provides search results including organic results, knowledge graph information, and related searches.\n\n" +
      "Example: googlesearch how does photosynthesis work";
    api.sendMessage(usage, event.threadID);
    return;
  }

  if (!query) {
    api.sendMessage("Please provide a search query.", event.threadID, event.messageID);
    return;
  }

  try {
    const API_BASE_URL = 'http://google.august-api.repl.co/search';
    const response = await axios.get(`${API_BASE_URL}?q=${encodeURIComponent(query)}`);

    const { organic, knowledge, related, people_also_ask } = response.data;

    let message = `🔎 Search Results for: ${query}\n`;

    if (organic && organic.length > 0) {
      message += "\n𝗢𝗥𝗚𝗔𝗡𝗜𝗖 𝗥𝗘𝗦𝗨𝗟𝗧𝗦:\n";
      organic.forEach((result, index) => {
        message += `\n${index + 1}.\n⦿ 𝗧𝗜𝗧𝗟𝗘: ${result.title}\n⦿ 𝗨𝗥𝗟: ${result.link}\n⦿ 𝗗𝗘𝗦𝗖𝗥𝗜𝗣𝗧𝗜𝗢𝗡: ${result.description}\n`;
      });
    }

    if (knowledge) {
      message += `\n𝗞𝗡𝗢𝗪𝗟𝗘𝗗𝗚𝗘:\n${knowledge.description}\n`;
    }

    if (related && related.length > 0) {
      message += "\n𝗥𝗘𝗟𝗔𝗧𝗘𝗗 𝗦𝗘𝗔𝗥𝗖𝗛𝗘𝗦:\n";
      related.forEach((relatedSearch) => {
        message += `⦿ 𝗧𝗜𝗧𝗟𝗘: ${relatedSearch.text}\n⦿ 𝗨𝗥𝗟: ${relatedSearch.link}\n`;
      });
    }

    api.sendMessage(message, event.threadID, event.messageID);
  } catch (error) {
    console.error('[ERROR]', error);
    api.sendMessage("An error occurred while performing the Google search.", event.threadID, event.messageID);
  }
}

module.exports = googlesearch;
