'use strict';
import {Dimensions} from "react-native";
const {width, height} = Dimensions.get("window");

export default {
  NewsUrl : 'https://newsapi.org/v1/articles?source=the-next-web&sortBy=latest&apiKey=a0f5a78c413e45cdab773a097d9c9e99',
  Debug: true,

  // for right to left language
  RTL: false,

  // check list available font: https://github.com/react-native-training/react-native-fonts
  fontFamily: 'Helvetica', // 'OpenSans',
  fontHeader: 'Avenir-Roman', //'Volkhov',
  fontHeaderAndroid: 'Roboto',

  firebaseEnable: false,

  PagingLimit: 20,

  logo: true,

  PostImage: {
    small: 'thumbnail',
    medium: 'medium',
    medium_large: 'medium',
    large: 'medium_large',
  },

  Animate: {
    bounce: 'bounce',
    flash: "flash",
    jello: "jello",
    pulse: "pulse",
    rotate: "rotate",
    rubberBand: "rubberBand",
    shake: "shake",
    swing: "swing",
    tada: "tada",
    wobble: "wobble",
    flipInY: "flipInY",
    flipInX: "flipInX",
    zoomIn: "zoomIn",
    fadeIn: "fadeIn",
    bounceIn: "bounceIn"
  },

  Layout: {
    card: 1,
    twoColumn: 2,
    simple: 3,
    list: 4,
    advance: 5,
    threeColumn: 6
  },

  Tags: {
    top: 'Top',
    headlight: 'Headlight',
    photo: 'Photos',
    video: 'Videos',
  },

  Menu: {
    Scale: 0,
    Flat: 1,
    FullSize: 2,
    MenuRightBlack: 3
  },

  Window: {
    width: width,
    height: height,
    headerHeight: 55 * height / 100,
    profileHeight: 45 * height / 100
  },

  Key: {
    email: "_Email",
    user: "_User",
    posts: "_Post"
  },

  fontText: {
    size: 12,
    fontSizeMin: 12,
    fontSizeMax: 20
  }
}
