const axios = require('axios');

async function eric(event, api) {
  const { threadID, messageID, body } = event;
  const args = body.split(' ');
  const searchQuery = encodeURIComponent(args.slice(1).join(' '));

  if (args.includes('-help')) {
    const usage = "Usage: eric [search_query]\n\n" +
      "Description: Searches for educational resources using the ERIC database.\n\n" +
      "Example: eric teaching methods";
    api.sendMessage(usage, threadID);
    return;
  }

  try {
    if (!searchQuery) {
      return api.sendMessage("Please provide a search query for Eric's content.", threadID, messageID);
    }

    const ericApiUrl = `http://ericeddov.august-api.repl.co/search-eric?search=${searchQuery}`;
    const response = await axios.get(ericApiUrl);

    const { results } = response.data;
    if (!results || results.length === 0) {
      return api.sendMessage("No results found for the given search query.", threadID, messageID);
    }

    const combinedResults = results.map((result, index) => `⦿ 𝗥𝗘𝗦𝗨𝗟𝗧 ${index + 1}\n𝗧𝗜𝗧𝗟𝗘: ${result.title || 'N/A'}\n𝗔𝗨𝗧𝗛𝗢𝗥: ${result.author || 'N/A'}\n𝗦𝗨𝗕𝗝𝗘𝗖𝗧: ${result.subject || 'N/A'}\n𝗣𝗨𝗕𝗟𝗜𝗦𝗛𝗘𝗥: ${result.publisher || 'N/A'}\n𝗗𝗘𝗦𝗖𝗥𝗜𝗡𝗧𝗜𝗢𝗡: ${result.description || 'N/A'}\n𝗣𝗨𝗕𝗟𝗜𝗖𝗔𝗧𝗜𝗢𝗡 𝗧𝗬𝗣𝗘: ${result.publicationType || 'N/A'}\n𝗣𝗨𝗕𝗟𝗜𝗖𝗔𝗧𝗜𝗢𝗡 𝗬𝗘𝗔𝗥: ${result.publicationDateYear || 'N/A'}\n𝗣𝗘𝗘𝗥 𝗥𝗘𝗩𝗜𝗘𝗪𝗘𝗗: ${result.peerReviewed || 'N/A'}\n𝗜𝗗: ${result.id || 'N/A'}`).join('\n\n');
    api.sendMessage(`🔎 Search results for "${searchQuery}":\n\n${combinedResults}`, threadID, messageID);

  } catch (error) {
    console.error('Error:', error.message);
    api.sendMessage('An error occurred while searching. Please try again later.', threadID, messageID);
  }
}

module.exports = eric;
