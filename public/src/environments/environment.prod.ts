export const environment = {
  production: true,
  apiUrl: "https://events-app-prod.herokuapp.com/api",
  socketUrl: "https://events-app-prod.herokuapp.com",
  constrains: {
    iceServers: [
      {
        urls: "stun:stun.stunprotocol.org"
      },
      {
        urls: 'turn:numb.viagenie.ca',
        credential: 'muazkh',
        username: 'webrtc@live.com'
      },
      // {
      //   urls: 'turn:1.2.3.4:19305',
      //   credential: 'credential',
      //   username: 'username'
      // }
    ]
  }
};


// apiUrl: "https://dodo-hosting.herokuapp.com/api",
// socketUrl: "https://dodo-hosting.herokuapp.com",