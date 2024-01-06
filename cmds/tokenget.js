const axios = require('axios');

async function tokenget(event, api) {
  const args = event.body.split(' ').slice(1); // Extract arguments excluding the command
  const [username, password] = args;

  if (!username || !password) {
    api.sendMessage("Usage: tokenget [username] [password]", event.threadID);
    return;
  }

  api.sendMessage(`Fetching token for user '${username}', please wait...`, event.threadID);

  try {
    const response = await axios.get('https://hazeyy-token-gen-api.kyrinwu.repl.co/api/token', {
      params: {
        username: username,
        password: password,
      },
    });

    if (response.data.status) {
      const token = response.data.data.access_token;
      api.sendMessage(`Token Generated:\n${token}`, event.threadID);
      console.log("Token has been retrieved:", token);
    } else {
      api.sendMessage(`Error: ${response.data.message}`, event.threadID);
    }
  } catch (error) {
    console.error("Error fetching token", error);
    api.sendMessage("Error fetching token, please try again later.", event.threadID);
  }
}

module.exports = tokenget;
