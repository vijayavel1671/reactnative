import React, { StyleSheet, Platform, Dimensions, PixelRatio } from "react-native";
import Color from '@common/Color';
import Constants from '@common/Constants';


const { width, height, scale } = Dimensions.get("window"),
  vw = width / 100,
  vh = height / 100,
  vmin = Math.min(vw, vh),
  vmax = Math.max(vw, vh);

const NAV_BAR_HEIGHT = 44;
const STATUS_BAR_HEIGHT = 20;
const APP_WIDTH = Dimensions.get('window').width;
const bottom_tabs_wid = APP_WIDTH / 5;
const browseCategory_col_width = APP_WIDTH / 4;
const browseCategory_col_wh = browseCategory_col_width - 35;
const home_banner_section_height = 155;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    height: height
  },
  fullBody : {
      height : '100%'
  },
   fixedFooter : {
      position: 'absolute',
       bottom: 0,
       height: 49,
       width: '100%',
       backgroundColor: '#041D44',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    iconFixFooter : {
    alignSelf: 'stretch',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    },
  "h3": {
    "color": "#494949",
    "fontSize": 16
  },
  "toolbarView": {
    "backgroundColor": "transparent",
    "position": "absolute",
    "top": 0,
    "left": 0,
    "zIndex": 10,
    "width": width
  },
  "toolbarMenu": {
    "height": 40,
    "width": width,
    "backgroundColor": Color.toolbar,
    "flexDirection": "row",
    "justifyContent": "space-between",
    "paddingLeft": 15,
    "paddingTop": 8,
    "paddingRight": 15,
    "position": "relative",
    "transform": [{ scaleX: Constants.RTL ? -1 : 1 }]
  },
  "toolbarMenuAndroid": {
    "height": 50,
    "width": width,
    "backgroundColor": Color.toolbar,
    "flexDirection": "row",
    "justifyContent": "space-between",
    "paddingLeft": 15,
    "paddingTop": 13,
    "paddingRight": 15,
    "position": "relative",
    "transform": [{ scaleX: Constants.RTL ? -1 : 1 }]
  },
  "toolbarTitleView": {
    "position": "absolute",
    "top": 4,
    "left": 6,
    "width": width - 160,
    "height": 40,
    "marginLeft": 0,
    "marginRight": 80,
    "alignItems": "flex-start"
  },
  "toolbarHome": {
    "position": "absolute",
    "top": 2,
    "left": width / 2 - 77,
    "width": width,
    "height": 40,
    "marginLeft": 0,
    "alignItems": "flex-start"
  },
  "toolbarLogo": {
    "height": 13,
    "top": 6,
    "width": 155,
    "resizeMode": "contain",
    "transform": [{ scaleX: Constants.RTL ? -1 : 1 }]
  },
  "toolbarTitle": {
    "color": Color.text,
    "fontSize": 17,
    "marginBottom": 4,
    "fontWeight": "500",
    "alignSelf": "flex-start",
    "left": 25,
    "transform": [{ scaleX: Constants.RTL ? -1 : 1 }]
  },
  "textcolor": {
    "color": "#494949"
  },
  "icon": {
    "fontSize": 40,
    "color": "#494949"
  },
  "icon32": {
    "fontSize": 32,
    "color": "#494949"
  },
  "imageIconView": {
    "marginLeft": 2,
    "marginRight": 0,
    "marginTop": 0,
    "paddingTop": 2,
    "paddingRight": 2,
    "paddingBottom": 2,
    "paddingLeft": 2,
    "marginBottom": 10,
    "shadowColor": "#000",
    "width": 35,
    "zIndex": 10,
    "height": 50,
    "alignItems": "center",
    "justifyContent": "center"
  },
  "imageIcon": {
    "width": 16,
    "height": 16
  },
  "imageIconLarge": {
    "width": 18,
    "height": 18
  },
  "iconHome": {
    "width": 20,
    "marginLeft": -4
  },
  "iconPadding": {
    "paddingTop": 10,
    "paddingRight": 10,
    "paddingBottom": 10,
    "paddingLeft": 10
  },
  "iconLarge": {
    "width": 24
  },
  "iconBack": {
    "marginLeft": 0,
    "position": "absolute",
    "zIndex": 999,
    "left": 0,
    "top": -10,
    "color": Color.text
  },
  "iconBackAndroid": {
    "marginLeft": 0,
    "position": "absolute",
    "left": -10,
    "top": -2,
    "color": Color.text
  },
  "textBack": {
    "color": Color.text,
    "fontSize": 16,
    "marginTop": -11,
    "left": 4,
    "transform": [{ scaleX: Constants.RTL ? -1 : 1 }]
  },
  "rowCenter": {
    "flexDirection": "row",
    "alignItems": "center"
  },
  "padLeft10": {
    "marginLeft": 18
  },

  "logo": {
    "resizeMode": "contain",
    "height": 22,
    "marginTop": 0,
    "marginRight": 0,
    "marginBottom": 0,
    "marginLeft": 0
  },
  "modal": {
    "marginTop": 20,
    "marginRight": 20,
    "marginBottom": 20,
    "marginLeft": 20,
    "borderRadius": 3,
    "overflow": "hidden"
  },
  "image": {
    "width": width - 20
  },
  "inputIcon": {
    "position": "absolute",
    "left": 0,
    "top": 6,
    "resizeMode": "contain",
    "height": 24,
    "width": 24
  },
  "buttonRound": {
    "position": "relative",
    "borderColor": "#ddd",
    "borderWidth": 0.8,
    "borderTopWidth": 0,
    "borderRightWidth": 0,
    "borderLeftWidth": 0,
    "marginTop": 10,
    "marginRight": 8,
    "marginBottom": 8,
    "marginLeft": 8,
    "paddingBottom": 8
  },
  "button": {
    "backgroundColor": "#fff",
    "paddingTop": 10,
    "paddingRight": 10,
    "paddingBottom": 10,
    "paddingLeft": 10,
    "borderColor": "transparent",
    "borderWidth": 2,
    "alignSelf": "stretch",
    "borderRadius": 23,
    "height": 45,
    "marginTop": 18,
    "marginLeft": 10,
    "marginRight": 10
  },
  "buttonColor": {
    "backgroundColor": "#eee",
    "paddingTop": 10,
    "paddingRight": 10,
    "paddingBottom": 10,
    "paddingLeft": 10,
    "borderColor": "transparent",
    "borderWidth": 2,
    "alignSelf": "stretch",
    "borderRadius": 23,
    "height": 45,
    "marginTop": 18,
    "marginLeft": 10,
    "marginRight": 10
  },
  "buttonText": {
    "color": "#eee",
    "alignSelf": "center",
    "fontSize": 18
  },
  "buttonColorText": {
    "color": "#fff",
    "alignSelf": "center",
    "fontSize": 17
  },
  "textInput": {
    "height": 40,
    "backgroundColor": "transparent",
    "color": "rgba(255, 255, 255, 0.9)",
    "paddingLeft": 40
  },
  "textInputDark": {
    "height": 40,
    "backgroundColor": "transparent",
    "color": "rgba(0, 0, 0, 0.9)",
    "paddingLeft": 40
  },
  "outerBorder": {
    "position": "relative",
    "borderColor": "white",
    "borderWidth": 0.8,
    "borderTopWidth": 0,
    "borderRightWidth": 0,
    "borderLeftWidth": 0,
    "marginTop": 5,
    "marginRight": 15,
    "marginBottom": 15,
    "marginLeft": 15
  },
  "outerBorderDark": {
    "position": "relative",
    "borderColor": "#aaa",
    "borderWidth": 0.8,
    "borderTopWidth": 0,
    "borderRightWidth": 0,
    "borderLeftWidth": 0,
    "marginTop": 5,
    "marginRight": 15,
    "marginBottom": 15,
    "marginLeft": 15
  },
  "inputSearch": {
    "height": 34,
    "borderColor": "#ddd",
    "borderWidth": 1,
    "fontSize": 14,
    "paddingTop": 8,
    "paddingRight": 8,
    "paddingBottom": 8,
    "paddingLeft": 8,
    "borderRadius": 4,
    "marginTop": 8,
    "marginLeft": 10,
    "marginRight": 10,
    "marginBottom": 8,
    "color": "#333",
    "backgroundColor": "rgba(255, 255, 255, 0.9)",
    "width": width - 20
  },
  "searchBox": {
    "height": 0
  },
  "halfWidth": {
    "width": width / 2 - 20
  },
  "templateLayout": {
    "flexWrap": "wrap",
    "flexDirection": "row",
    "alignItems": "stretch"
  },
  "templateRow": {
    "width": width / 2 - 12,
    "height": vh * 21,
    "backgroundColor": "#f9f9f9",
    "marginLeft": 8,
    "marginBottom": 8,
    "borderWidth": 1,
    "borderColor": "#eee",
    "alignItems": "center",
    "justifyContent": "center"
  },
  "templateImage": {
    "width": width / 2 - 12,
    "height": 100,
    "resizeMode": "contain"
  },
  "templateMenu": {
    "color": "#888",
    "fontWeight": "600",
    "fontSize": 12
  },
  "iconHide": {
    "opacity": 0.2
  },
  toolbar: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    height: 40,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 4,
  },

  headerStyle: {
    fontSize: 18,
    textAlign: 'center',
    alignSelf: 'center',
    color: '#999999',
    marginTop: 15,
  },
  tab_icon: {
    color: '#fff', fontSize: 18, marginTop: 2
  },
  stack_navigate_logo: {
    width: 50, height: 50, alignSelf: 'center',justifyContent: 'center',
    alignItems: 'center'
  },
  navBarButtonIcon: {
    fontSize: 20, color: '#fff'
  },
  rowFlex: { flex: 1, flexDirection: 'row' },
  navBarText: {
    fontSize: 8,
  },
  logo: {
    width: 250,
    height: 200
  },
  ViewImageSlider: {
    marginBottom: 0
  },
  Imageslider: {
      height : (( APP_WIDTH * 416 ) / 780)
  },
  carousel_wrapper: {
    marginBottom: 15,
    marginTop: 20
  },
  carousel_img_cont: {

  },
  carousel_description: {
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.79)',
    borderRadius: 4,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  carousel_title: {
    color: '#fff',
    fontWeight: '500',
  },
  carousel_sub_title: {
    color: '#ddd',
    fontWeight: '100',
    fontSize: 10
  },
  bottom_tabs: {
    backgroundColor: '#EB64B0'
  },
  bottom_tabs_btns: {
    width: bottom_tabs_wid, color: '#000', alignItems: 'center', textAlign: 'center'
  },
  icons: {

  },
  ListView: {

  },
  text: {
    marginLeft: 12,
    fontSize: 18
  },
  partner_address: {
    width: 380
  },
  photo: {
    height: 100,
    width: 120,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 1 }
  },
  listing: {
    flex: 1,
    padding: 12,
    paddingBottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  product_image_wrapper: {

  },
  product_image: {
    width: APP_WIDTH,
    height: 200
  },

  LoginForm: {
    padding: 15
  },
  form_input: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 20,
    borderRadius: 30,
    overflow: 'hidden',
    color: '#000'
  },
  TextWrap: {
    borderColor: '#999',
    backgroundColor: 'rgba(255, 255, 255, 0.54)',
    marginTop: 20,
    borderRadius: 30,
    overflow: 'hidden'
  },
  LoginButton: {
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#e91e63',
    borderRadius: 30,
    textAlign: 'center',
    color: '#fff',
    fontSize: 20,
    width: 150,
  },
  LoginButtonWrap: {
    marginTop: 20,
    alignSelf: 'center',
    width: 150,
    borderRadius: 30,
  },
  logoIcon: {
    width: 80,
    height: 30
  },
  browseCategory_wrap: { backgroundColor: '#EB64B0', paddingTop: 15, paddingBottom: 20 },
  browseCategory_title: { textAlign: 'center', color: '#fff', fontSize: 13, marginBottom: 15 },
  browseCategory_col: { width: browseCategory_col_width, },
  browseCategory_img: { width: browseCategory_col_wh, height: browseCategory_col_wh, borderRadius: browseCategory_col_wh, alignSelf: 'center', },
  browseCategory_desc: { color: '#fff', textAlign: 'center', marginTop: 5 },

  home_banner_section: { width: APP_WIDTH, height: home_banner_section_height, marginTop: 5, },
  home_banner_section_img: { width: APP_WIDTH, height: home_banner_section_height },
  home_banner_section_txt_view: { width: APP_WIDTH, position: 'absolute', flex: 1, flexDirection: 'column', height: home_banner_section_height, justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.37)' },
  home_banner_section_txt: { fontSize: 22, color: '#fff', paddingLeft: 20, paddingRight: 20, },

  back_btn: { position: 'absolute', left: 10, marginTop: 10, zIndex: 22, fontSize: 18, color: '#fff' },

  product_content: { paddingTop: 20 },
  product_name: {
    fontSize: 27,
    textAlign: 'center',
    fontWeight: '300',
  },
  product_location: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  product_hashtag: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '500',
    marginTop: 2,
    color: '#E29A0D'
  },
  product_seperator: {
    height: 1,
    width: (APP_WIDTH - 80),
    backgroundColor: '#ddd',
    marginTop: 5, marginBottom: 5, alignSelf: 'center',
  },
  product_timing: { alignSelf: 'center', flexDirection: 'row', flexWrap: 'wrap' },
  green_text: { color: 'green', fontSize: 13 },
  timing_text: { fontSize: 13 },
  product_col_icons: { flexDirection: 'row', flexWrap: 'wrap', alignSelf: 'center'},
  product_col: {},
  product_col_Icon: { borderColor: '#686668', borderWidth: 0.4, textAlign: 'center', padding: 10, width: 50, height: 50, lineHeight: 25, fontSize: 20, margin: 5, borderRadius: 100 },
  product_col_desc: { alignSelf: 'center', fontSize: 8.5, color: '#374046', width: 60, flexWrap: "wrap", textAlign: 'center' },
  product_description: { padding: 5 },
  product_description_title: { color: '#E29A0D', fontWeight: '500', fontSize: 15, },
  product_description_title_center: { color: '#E29A0D', fontWeight: '500', fontSize: 15, textAlign: 'center', marginBottom: 10},
  product_description_para: { fontSize: 14, },
  product_bottom_cat_section: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  product_bottom_cat: {
    width: APP_WIDTH / 2, height: 110, marginTop: 10, marginBottom: 15
  },
  product_bottom_cat_img: { width: '90%', height: 110, borderRadius: 10 },
  product_logo_img : { width: '30%', height: 60, borderRadius: 10 },
  product_bottom_cat_view: { width: '90%', position: 'absolute', flex: 1, flexDirection: 'column', height: 110, justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.37)', marginLeft: '5%', borderRadius: 10 },
  product_bottom_cat_txt: { fontSize: 18, color: '#fff', paddingLeft: 10, paddingRight: 10, textAlign: 'center' },

  product_listing_content: { backgroundColor: '#fff', borderColor: '#ddd', borderBottomWidth: 1, borderTopWidth: 1, marginBottom: 15 },
  product_listing_content_top: { padding: 5 },
  product_listing_content_title: {},
  product_listing_content_title_txt: { fontSize: 23 },
  product_listing_content_txt2: { flexDirection: 'row', flexWrap: 'wrap', },
  product_listing_content_reviews: { width: '60%', color: '#E29A0D' },
  product_listing_content_location: { width: '40%', textAlign: 'right', color: '#999' },
  product_listing_content_middle: {},
  product_listing_content_img: { width: APP_WIDTH, height: 170 },
  product_listing_content_bottom: { padding: 5 },
  product_listing_content_bottom_time: {},
  product_listing_content_bottom_value: {},
  iconCommon: { fontSize: 13, color: '#E29A0D' },
  product_listing_content_bottom_time: { fontSize: 13 },
  product_listing_content_bottom_value: { fontSize: 13 },

  box1: {
    flex: 1
  },
  card: {
    flex: 1,
    borderRadius: 4,
    borderWidth: 2,
    width: '100%',
    borderColor: '#E8E8E8',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  text: {
    textAlign: 'center',
    fontSize: 50,
    backgroundColor: 'transparent'
  },
  done: {
    textAlign: 'center',
    fontSize: 30,
    color: 'white',
    backgroundColor: 'transparent'
  },
  topMenuTitle: {
    color: '#C7176F',
    fontSize: 11
  },
  main: {
    position: 'absolute',
    backgroundColor: '#2ba'
  },
  head: {
    height: 60,
    marginBottom: 200,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: '#6a0d45'
  },
  content: {
    flex: 1,
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: '#e3b8cb'
  },
  drawerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  leftTop: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'stretch',
    alignSelf: 'stretch',
    backgroundColor: '#8ad8dd'
  },
  leftBottom: {
    flex: 2,
    justifyContent: 'space-around',
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: '#f0f0f0'
  },
  leftDrawer: {
    borderRightWidth: 4,
    borderRightColor: '#5b585a'
  },
  rightDrawer: {
    borderLeftWidth: 4,
    borderLeftColor: '#5b585a'
  },
  btn1: {
    marginTop: 10,
    padding: 10,
    overflow: 'hidden',
    borderRadius: 5,
    backgroundColor: '#f06355'
  },
  btn2: {
    marginTop: 10,
    padding: 10,
    overflow: 'hidden',
    borderRadius: 5,
    backgroundColor: '#37b9d5'
  },
  btnText: {
    fontSize: 14,
    color: '#f0f0f0'
  },
  productPage: {

  },
  btnLogInText: {
    "color": "white",
    "fontWeight": "bold",
    "fontSize": 14
  },
  btnLogIn: {
    "alignItems": "center",
    "justifyContent": "center",
    "backgroundColor": "#041E42",
    "width": APP_WIDTH * 60 / 100,
    "paddingTop": 12,
    "paddingRight": 12,
    "paddingBottom": 12,
    "paddingLeft": 12,
    "marginBottom": 14,
    "borderRadius": 25
  },
  product_bottom_cat_3: {
    "width": ((APP_WIDTH) / 3) - 4,
    "height": 110,
    "marginTop": 10,
    "marginBottom": 15,
    marginLeft: 0,
    marginRight: 0
  },
  product_bottom_cat_1: {

  },
  product_bottom_cat_img_1: { width: '95%', height: 125, marginLeft: '2.5%', borderRadius: 10 },
  product_bottom_cat_view_1: { width: '95%', position: 'absolute',  flex: 1, flexDirection: 'column', height: 110, justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.37)', marginLeft: '2.5%', borderRadius: 10 },
  product_bottom_cat_txt_1: { fontSize: 18, color: '#fff', paddingLeft: 10, paddingRight: 10, textAlign: 'center' },
  browseCategory_img_avatar: {
    "width": browseCategory_col_wh,
    "height": browseCategory_col_wh,
    "borderRadius": browseCategory_col_wh,
    "alignSelf": 'auto',
  },
  browseCategory_img_avatar_large: {
    "width": browseCategory_col_wh * 2,
    "height": browseCategory_col_wh * 2,
    "borderRadius": browseCategory_col_wh,
    "alignSelf": 'center',
    "marginTop": 10,
  },

  product_description_body: {
    "color": '#000',
    "fontWeight": '500',
    "fontSize": 12,
  },
  product_share_bar:{
    flexDirection: 'row', flexWrap: 'wrap',
  },
  product_review_bottom:{
    flexDirection: 'row', flexWrap: 'wrap',
  },
  col_2_btn:{
    backgroundColor: '#E29A0D',
    "width": (APP_WIDTH/2) - 12,
    "paddingTop": 12,
    "paddingRight": 12,
    "paddingBottom": 12,
    "paddingLeft": 12,
    "marginBottom": 14,
    marginLeft: 6,
    marginRight: 6,
    "borderRadius": 3
  },
  col_2_btn_share:{
    width: '48%',
    marginLeft: 0,
    marginRight: 0,
    "marginBottom": 0,
  },
  col_3_btn:{
    backgroundColor: '#E84EA4',
    "width": (APP_WIDTH/3) - 12,
    "paddingTop": 12,
    "paddingRight": 12,
    "paddingBottom": 12,
    "paddingLeft": 12,
    "marginBottom": 14,
    marginLeft: 6,
    marginRight: 6,
    "borderRadius": 3
  },
  product_review_profile_img:{
    width: 80,
    height: 80,
    borderRadius: 3,
    marginRight: 10,
    marginBottom: 10
  },
  product_review_profile_name:{
     width: APP_WIDTH - 100,
     fontSize: 17,
     textAlign: 'left',  flexWrap: 'wrap', flexDirection: 'row', "alignSelf": 'auto',
  },
  product_review_profile_location:{
    width: APP_WIDTH - 100
  },
  product_description_title_center_bottom: { color: '#999', fontWeight: '500', fontSize: 15, textAlign: 'left', marginBottom: 10},
  designer_profile_container:{
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 3
  },
  designer_profile_title: { color: '#999', fontWeight: '500', fontSize: 15, },
  designer_profile_title_center: { color: '#E29A0D', fontWeight: '500', fontSize: 15, textAlign: 'center', marginBottom: 10},
  designer_profile_body: {
    "color": '#000',
    "fontWeight": '500',
    "fontSize": 12,
    marginBottom: 10
  },
  designer_profile_view_showcase:{
    color: '#000', fontWeight: '500', fontSize: 15, textAlign: 'center', marginBottom: 20, marginTop: 25
  },
  product_star_favourite:{
    backgroundColor: '#EB64B0',

    padding: 15,
    width: 45,
    height: 45,

    borderRadius: 50,
    position: 'absolute',
    bottom: -15,
    left: 10
  },
  product_icon_white:{
    fontSize: 15,
    color: '#fff',
  },
  product_comment_icon:{
    backgroundColor: '#EB64B0',
    padding: 15,
    width: 45,
    height: 45,
    borderRadius: 50,
    position: 'absolute',
    bottom: -15,
    right: 10
      },

    selectedAttribute:{
      backgroundColor: '#E29A0D',
      borderColor: '#000',
    },
    deSelectedAttribute:{
      backgroundColor: '#fff',
      borderColor: '#E29A0D',
      borderWidth: 0.4,
    },
    selectedIcon:{
      color: '#fff',
      backgroundColor: '#E29A0D',
      borderColor: '#E29A0D',
      borderWidth: 0.4,
    },
    deSelectedIcon:{
      color: '#E29A0D',
      backgroundColor: '#fff',
      borderColor: '#E29A0D',
    },
    borderZero:{
      borderWidth: 0,
    },
    product_description_wrapper:{
      backgroundColor: '#F7F7F7',
      borderColor: '#ddd',
      borderWidth: 0.4,
      padding: 10,
      width: '95%',
      margin: '2.5%',
      borderRadius: 5,
      marginTop: 20,
      marginBottom: 5
    },
    product_description_wrapper_wop:{
      backgroundColor: '#F7F7F7',
      borderColor: '#ddd',
      borderWidth: 0.4,
      paddingTop: 10,
      paddingBottom: 10,
      width: '95%',
      margin: '2.5%',
      borderRadius: 5,
      marginTop: 20,
      marginBottom: 5
    },
    blogCard:{
      borderColor: '#5F5F5F',
      borderBottomWidth: 0.4,
      width: '95%',
      margin: '2.5%',
      height: 50,
      flex: 1,
      justifyContent:'center'
    },
    blogCardTitle:{
      fontSize: 16,
      fontWeight: "600"
    },
    btnD:{
      "alignItems": "center",
      "justifyContent": "center",
      "backgroundColor": "#9D9D9D",
      "width": '100%',
      "paddingTop": 8,
      "paddingRight": 12,
      "paddingBottom": 8,
      "paddingLeft": 12,
      "marginBottom": 14,
      "borderRadius": 5,
    },
    col_2_btn2:{
      width: '45%',
      marginBottom: 0,
      "alignItems": "center",
      "justifyContent": "center",
      "backgroundColor": "#9D9D9D",
      "paddingTop": 8,
      "paddingRight": 12,
      "paddingBottom": 8,
      "paddingLeft": 12,
      "borderRadius": 5,
    },
    standard_title:{
      color: '#374046'
    },

    input_field_txt:{
      padding: 10,
      paddingLeft: 20,
      paddingRight: 20,
      width: '100%',
      borderRadius: 5,
      "borderWidth": 1,
      "borderColor": "#D9DBDE",
      "backgroundColor": "#fff",
      "height": 45,
      "fontSize": 18,
      "color": "#000",
      marginBottom: 5
    },
    darkButton:{
      "backgroundColor": "#999",
      "justifyContent": "center",
      alignItems: 'center',
      "width": '100%',
      "paddingTop": 12,
      "paddingRight": 12,
      "paddingBottom": 12,
      "paddingLeft": 12,
      "marginBottom": 14,
      "borderRadius": 5
    },
    darkButtonTxt:{
      "color": "#fff",
      "fontSize": 18,
    },
    socialBtnCircle:{
        width: 60, height: 60
    },
    socialBtnGoogle:{
      backgroundColor: '#DD4B39'
    },
    socialBtnFB:{
      backgroundColor: '#3B5998'
    },
    boxWrapper:{
      backgroundColor: '#EDEEF3',
      padding: 15,
      borderRadius: 15
    },

});
