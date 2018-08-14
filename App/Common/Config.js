import Constants from "./Constants";

export default {
  AppName: "Zingbi",
  AppVersion: '2.6',
  // ApiUrl : "http://realarticles.com/zingbi/admin/public/api/",
  // BaseUrl : "http://realarticles.com/zingbi/admin/public/",
  // ApiUrl: "http://admin.zingbi.com/api/v1/", //Live
   ApiUrl: "http://qa.zingbi.com/admin/zingbi-admin-new/public/api/v1/", //Testing
  ApiUrlVTwo: "http://qa.zingbi.com/admin/public/api/v2/",
  blogUrl: 'http://qa.zingbi.com/web/public/blog/',
  storeUrl: 'https://www.zingbi.com/store/',

  // BaseUrl: "http://qa.zingbi.com/admin/public/",
  //local
  // ApiUrl : "http://192.168.1.106:8001/api/",
  //local
  BaseUrl: "https://zingbi.s3.amazonaws.com/", //Will be used for media

  PlayStoreUrl: 'http://play.google.com/store/apps/details?id=com.zingbi.app',

  AppStoreUrl: 'https://itunes.apple.com/ae/app/zingbi/id1254000811?mt=8',

  NoImageUrl: 'https://www.zingbi.com/assets/images/placeholder.jpg',

  // default language from the Languages.js file
  Language: "en",

  showFacebookAds: false,

  Firebase: {
    apiKey: "AIzaSyAZhwel4Nd4T5dSmGB3fI_MUJj6BIz5Kk8",
  },

  Facebook: {
    adPlacementID: "1809822172592320_1981610975413438",
   // APPID: "102106493697058",
   APPID: "2157348804497396",
    sizeAds: "standard" // standard, large
  },

  Google: {
    androidClientId:
      "160302230949-knm3ophji8u18ls1lmb92b805p32qf8f.apps.googleusercontent.com",
    iosClientId:
      "160302230949-6hhtsvdu36jdih9lhdolbomvlifemj30.apps.googleusercontent.com",
    webClientId:
      "160302230949-2ol29qvqng231mdmckni1ja5pc944pq5.apps.googleusercontent.com",
    AnalyticsId: "UA-100934889-1"
    // AnalyticsId : "UA-100010079-1" (Testing)
  },
  Mixpanel: {
    token: "300ff76292f3471b52daf2d363f58579"
  },

  tabBarAnimate: Constants.Animate.zoomIn
};
/*AndroidClientID
160302230949-knm3ophji8u18ls1lmb92b805p32qf8f.apps.googleusercontent.com

IOSClientID
160302230949-6hhtsvdu36jdih9lhdolbomvlifemj30.apps.googleusercontent.com

iOS URL scheme
com.googleusercontent.apps.160302230949-6hhtsvdu36jdih9lhdolbomvlifemj30

Web
Client ID
160302230949-2ol29qvqng231mdmckni1ja5pc944pq5.apps.googleusercontent.com
Client secret
ekwCaRw29R0NhJGKnSHxxw0Q*/
