import React, {StyleSheet, Platform, Dimensions, PixelRatio} from "react-native";
import {Color, Constants} from '@common';

const {width, height, scale} = Dimensions.get("window"),
    vw = width / 100,
    vh = height / 100,
    vmin = Math.min(vw, vh),
    vmax = Math.max(vw, vh);

export default StyleSheet.create({
    "wrap": {
        "marginTop": 4,
        "marginRight": 10,
        "marginBottom": 4,
        "marginLeft": 10,
        "borderRadius": 8,
        "height": vh * 60
    },
    "body": {
        "borderRadius": 3,
        "height": vh * 40,
        "overflow": "hidden",
        "backgroundColor": "rgba(255, 255, 255, 0.9)"
    },
    "header": {
        "flexDirection": "row",
        "justifyContent": "center",
        "position": "relative"
    },
    "headerLeft": {
        "position": "absolute",
        "left": 0,
        "top": 0,
        "marginTop": 10,
        "marginRight": 10,
        "marginBottom": 10,
        "marginLeft": 10
    },
    "headerTitle": {
        "alignItems": "center",
        "justifyContent": "center"
    },
    "headerTitleText": {
        "color": "#000",
        "fontWeight": "600",
        "fontSize": 20,
        "marginTop": 10
    },
    "imageBack": {
        "width": 18,
        "height": 20,
        "flex": 1
    },
    "wrapLogo": {
        "flex": 1,
        "alignItems": "center",
        "justifyContent": "center"
    },
    "styleLogo": {
        "color": "rgba(72,194,172,1)",
        "fontSize": 40
    },
    "wrapForm": {
        "flex": 1,
        "paddingTop": 16,
        "paddingRight": 16,
        "paddingBottom": 16,
        "paddingLeft": 16,
        "position": "relative"
    },
    "textInput": {
        "borderBottomWidth": 1,
        "paddingTop": 0,
        "paddingRight": 12,
        "paddingBottom": 0,
        "paddingLeft": 12,
        "marginTop": 0,
        "marginRight": 0,
        "marginBottom": 10,
        "marginLeft": 0,
        "borderBottomColor": "rgba(0,0,0, 0.2)",
        "backgroundColor": "#eee",
        "height": 40,
        "borderRadius": 2,
        "fontSize": 15,
        "color": "#333"
    },
    "textInputWrap": {
        "marginTop": 10
    },
    "textLabel": {
        "fontSize": 12,
        "color": "#333",
        "fontWeight": "500",
        "marginBottom": 8,
        "marginTop": 8
    },
    "forgotPass": {
        "position": "absolute",
        "bottom": 20,
        "right": 10,
        "zIndex": 9999
    },
    "btnLogInText": {
        "color": "white",
        "fontWeight": "bold",
        "fontSize": 14
    },
    "orText": {
        "color": "#E84EA4",
        "fontSize": 14,
        "marginTop": 0,
        "marginRight": 15,
        "marginBottom": 0,
        "marginLeft": 15
    },
    "forgotPassText": {
        "color": "#555",
        "textAlign": "right",
        "fontSize": 13
    },
    "underbtnLogin": {
        "flexDirection": "row",
        "alignItems": "center",
        "justifyContent": "center"
    },
    "btnLogInFace": {
        "alignItems": "center",
        "justifyContent": "center",
        "backgroundColor": "rgb(59,89,152)",
        "paddingTop": 9,
        "paddingRight": 9,
        "paddingBottom": 9,
        "paddingLeft": 9,
        "marginTop": 15,
        "flexDirection": "row"
    },
    "bottomWrap": {
        "flex": 1/2,
        "position": "relative"
    },
    "bottomWrapContent": {
        "flexDirection": "row",
        "position": "absolute",
        "bottom": 16,
        "left": width/4
    },
    "btnSignUpText": {
        "color": "rgb(72,194,172)",
        "fontSize": 14,
        "fontWeight": "bold"
    },
    "wrapButton": {
        "flex": 1,
        "marginTop": 20,
        "marginRight": 15,
        "marginBottom": 15,
        "marginLeft": 15,
        "justifyContent": "flex-end",
        "alignItems": "center"
    },
    "btnLogIn": {
        "alignItems": "center",
        "justifyContent": "center",
        "backgroundColor": "#E84EA4",
        "width": width * 60/100,
        "paddingTop": 12,
        "paddingRight": 12,
        "paddingBottom": 12,
        "paddingLeft": 12,
        "marginBottom": 14,
        "borderRadius": 25
    },
    "buttonView": {
        "backgroundColor": "#eee",
        "borderColor": "#eee",
        "flex": 1,
        "flexDirection": "row"
    },
    "btnLogInLabel": {
        "color": "#999",
        "fontWeight": "bold",
        "marginLeft": 10,
        "fontSize": 14
    }
});