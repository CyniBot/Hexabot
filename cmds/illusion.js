const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function illusion(event, api) {
  const input = event.body.toLowerCase().split(' ');

  if (input.includes('-help')) {
    const usage = "Usage: illusion [prompts]\n\n" +
      "Description: Generates images with illusion using the replied image and prompts.\n\n" +
      "Example: illusion surreal landscape, futuristic city";
    api.sendMessage(usage, event.threadID);
    return;
  }

  // Check if the user replied to a message
  if (event.messageReply) {
    const messageReply = event.messageReply;

    // Check if the replied message has a single photo attachment
    if (messageReply.attachments.length === 1 && messageReply.attachments[0].type === 'photo') {
      const imageUrl = messageReply.attachments[0].url;

      // Extract prompts from the user's input
      const prompts = input.slice(1).join(' ');

      try {
        const response = await axios.get(`https://celestial-3ode.onrender.com/illusion?image=${encodeURIComponent(imageUrl)}&prompt=${encodeURIComponent(prompts)}`);
        const illusionResponse = response.data;

        if (illusionResponse && illusionResponse.output) {
          // Save the generated image locally
          const inputPath = path.join(__dirname, '..', 'temp', 'illusion.png');
          const imageBuffer = await axios.get(illusionResponse.output, { responseType: 'arraybuffer' });
          fs.writeFileSync(inputPath, imageBuffer.data);

          // Send the image as an attachment
          const imageAttachment = fs.createReadStream(inputPath);
          api.sendMessage({
            body: 'Generated Illusion Image:',
            attachment: imageAttachment
          }, event.threadID, () => fs.unlinkSync(inputPath));
        } else {
          api.sendMessage('Unable to generate illusion image at the moment. Please try again later.', event.threadID);
        }
      } catch (err) {
        console.error(`Error generating illusion image: ${err}`);
        api.sendMessage('Failed to generate illusion image. Please try again later.', event.threadID);
      }
    } else {
      api.sendMessage('[ERR] Invalid image. Please reply to a single photo.', event.threadID);
    }
  } else {
    api.sendMessage('[ERR] Please reply to a message containing a photo to use it for the illusion.', event.threadID);
  }
}

module.exports = illusion;
