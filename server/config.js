module.exports = {
  logLevel: 'debug',
  uri: 'http://findawake.com/',

  zapier : {
    email: {
      meetup: 'https://zapier.com/hooks/catch/bl3xal/',
      welcome: 'https://zapier.com/hooks/catch/blg288/'
    },
    sms: 'https://zapier.com/hooks/catch/bl8czf/'
  },

  firebase: {
    account: 'https://findawake.firebaseio.com',
    token : 'YYM6RxwtABV1jlzgIw3wXThPxSKEIM5ufkdrFLZB'
  },

  moment: {
    dateFormat: 'dddd, MMMM Do',
    timeFormat: 'h:mm a' 
  }
};