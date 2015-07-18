module.exports = {
  logLevel: process.env.LOG_LEVEL || 'debug',
  uri: process.env.ENV_URI || 'http://findawake.com/',

  zapier : {
    email: {
      meetup: 'https://zapier.com/hooks/catch/bl3xal/',
      welcome: 'https://zapier.com/hooks/catch/blg288/'
    },
    sms: 'https://zapier.com/hooks/catch/bl8czf/'
  },

  firebase: {
    account: process.env.FIREBASE_ACCOUNT || 'https://findawake.firebaseio.com',
    token : process.env.FIREBASE_TOKEN || 'YYM6RxwtABV1jlzgIw3wXThPxSKEIM5ufkdrFLZB'
  },

  moment: {
    dateFormat: 'dddd, MMMM Do',
    timeFormat: 'h:mm a' 
  }
};