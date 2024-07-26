const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// Replace with your Telegram bot token
const botToken = '7356422620:AAEjvziHjFnXMXrGyCyABpPr6iDgqsZsZAM';
const bot = new TelegramBot(botToken, { polling: true });

// Mail.tm API base URL
const mailTmBaseUrl = 'https://api.mail.tm';

// Endpoint paths
const endpoints = {
  createAccount: '/accounts',
  getMessages: '/messages',
};

// Helper function to create a Mail.tm account
async function createMailTmAccount() {
  try {
    const response = await axios.post(`${mailTmBaseUrl}${endpoints.createAccount}`, {
      address: `testuser${Date.now()}@mail.tm`,
      password: 'securepassword', // Choose a strong password
    });

    return response.data;
  } catch (error) {
    console.error('Error creating Mail.tm account:', error.message);
    throw error;
  }
}

// Helper function to get messages from the Mail.tm account
async function getMailTmMessages(token) {
  try {
    const response = await axios.get(`${mailTmBaseUrl}${endpoints.getMessages}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching Mail.tm messages:', error.message);
    throw error;
  }
}

// Handle incoming messages from Telegram
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;

  try {
    const account = await createMailTmAccount();
    const token = account.token; // Replace with the actual token from the response

    const messages = await getMailTmMessages(token);

    bot.sendMessage(chatId, `Mail.tm account created: ${account.address}`);
    bot.sendMessage(chatId, `Recent messages: ${JSON.stringify(messages, null, 2)}`);
  } catch (error) {
    bot.sendMessage(chatId, 'Failed to create account or fetch messages.');
  }
});
