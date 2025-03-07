import browser from 'webextension-polyfill';

browser.runtime.onInstalled.addListener(() => {
  console.log('MailBox extension installed');
});

// Set up listener for any background tasks
browser.runtime.onMessage.addListener((message, sender) => {
  if (message.action === 'checkForNewEmails') {
    // Implement periodic email checking if needed
    return Promise.resolve({ success: true });
  }
  return Promise.resolve();
});