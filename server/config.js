module.exports = {
  logLevel: 'debug',
  uri: 'staging.findawake.com/',

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
  },

  google: {
    auth: {
      scopes: ['https://www.googleapis.com/auth/gmail.modify','https://www.googleapis.com/auth/urlshortener'],
      private_key_id : '79d032687049a4b2069716b98a44ed2b05d9cce2',
      private_key : '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCeKfQed4lsKrfY\nDaxNjZyf7DSyE0ONrEMX7IdqCDexMzTp/H7jZjPUgBFeAJUT+2xigXV3Fzn312/Z\n0Puh6+Nf7lzMhZsnpQwWL7yGZ1tEXDWPCfSGZa6dJZyvsjTJo4aSvtmyt/aV6rPa\nRbAH54O5to0/B4UCI8eIxm5grUYw5Rumz6Imk2VzRiCa7voIqXJ5oFqS7dBH1djb\neE09TFaWZG+6u4HGpforDJiwtcZsXxIPBRyFUqHuENzJQ2H9X6uxsVKwG5Odo0tG\nif/sr/R1F0MwJUwb7inRzJXJP/2XiaTf9LPMgRn2zVDw4T8zF7aSs1bPOIqkKjAi\nqntpOmxVAgMBAAECggEAfTqWkTDwW/aOzcA1tsnzQyRQrNZX3GqSTPT4WtnazrDO\nqp1DEmWvkAc+uQEZCFNAA9ag3QRE35lydDHlqtUMmL4wN7dpm8Awi7iMOpbHSp7/\nwRuOwoLr+Hz5TJt69FRHjxURZVIHKbhFYwNeV0PVpkuGFmurwn/10rPaXS2Ur8zY\nX5ztk01bmnSIrRi2DBUtiv5ychEVEZBiydhBfn/AmiQxTGCb+p/FJXBjoUnKUKif\nzFXHt2Kmc/8kGAG7ADpBdjdFpIsYUNDM0vo2adblN1x1zMi5d6mRTa2WHZL2wA7/\ncu5iBHUJ7fZqhqdX4+BRhgbeyIyMSKzs5cu29eMYGQKBgQDSK1miNxZe1NZ9aNJs\nG6mQ7Mzuyw1EzyTXEMW8bbwdw+9qcpU7xdbnG415xug5DAj3ZV67msg0VEaAgkB8\n2XQiDQ7PG0YjdcdxYoR6TLTqaJKg4DkflSSTWSppIc5ZHAdopVz5k5U/uouIVG3t\ncLLO74pNbb0tBO7TfL6CSW8fDwKBgQDAp2mAkh85thYv82FIT1ud3Igg5boqlXxx\nkHeQaZJWgzOEJjUXiwmMLqOiIu+V6Lk+61Y39lcDCJ5xHume4yWOrEc0iZx9w0TR\nfrYxr5Vz+FyCTCQRw+YRscJaEPdofuoCW+8ni3u9zbSBUQwbizyILBK+N3Ym3SQ5\n0GBme39+WwKBgDFTNT0p+pkVEKXsNP5kW56ExPACPcH5b6b967p2cqD1vDnaXIXj\nv7ULtV9wPE4vMeeGJf6XrAcEBGvipennSyc2s1QODZ8C5GUK/xaI7CjblBYnqaBs\n62GdmqOD6J7nQiHgNXrplSyYxmifkBEa0wxYEbhsWeq37qk57Kg9PdQnAoGANT+Q\nd4rruoXLiCFa6COXDQDhV0ZnuFFs/e6SPYYQfnzxBjuRPRqe3vIdJDlHw0V5vhxJ\nzln2Hs6JDHcg11utC8wuOiU27cPFB6pgLUd8pXsmBpWI+qgMtSNOtpot5+H8R/6l\nEWcKIqHynDOMhyhq6LBV1eF6dK92zcv8eRb1XDUCgYEAn0qy0Enbn5ixLfZVLqt/\nYvstb1VIcGiTRpveRJa/+Q431byTyuXxlw44+0HNwPXZe1M6dNtscEvCqtO9U9/b\nv/34mbzzkhSxo0kCQijt1ARv1yz8r8xdqLEQLRzYvZGYbnlXDnpfd1OUO8bwbxaD\nB2pjVQMolXlc7nCUPzLRT6Y\u003d\n-----END PRIVATE KEY-----\n',
      client_email : '78864326005-m613ncm6opmbpdbja81sgknvcg9viu4l@developer.gserviceaccount.com',
      client_id : '78864326005-m613ncm6opmbpdbja81sgknvcg9viu4l.apps.googleusercontent.com',
      type: 'service_account'
    },
    user: 'support@findawake.com'
  }
};