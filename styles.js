import { Dimensions, Alert } from 'react-native';
const NAV_BAR_HEIGHT = 44;
const STATUS_BAR_HEIGHT = 20;
const APP_WIDTH = Dimensions.get('window').width;
const APP_HEIGHT = Dimensions.get('window').height;
const bottom_tabs_wid = APP_WIDTH / 5;
const browseCategory_col_width = APP_WIDTH / 4;
const browseCategory_col_wh = browseCategory_col_width - 35;
const home_banner_section_height=0;


home_banner_section_height =  (APP_WIDTH * 40)/100;
who_what_wear_img_height = APP_WIDTH * 0.83;


module.exports = {
  Container: {
    flex: 1,
  },
  tab_icon:{
    color: '#fff', fontSize: 18, marginTop: 2
  },
  stack_navigate_logo:{
    width: 50, height: 50, alignSelf: 'center',
  },
  navBarButtonIcon:{
    fontSize: 20, color: '#fff'
  },
  rowFlex:{flex: 1, flexDirection: 'row'},
  navBarText:{
    fontSize: 8,
  },
  logo:{
    width: 250,
    height: 200,
  },
  ViewImageSlider:{
    marginBottom: 0, marginTop: 15
  },
  ImageSlider:{
  },
  carousel_wrapper:{
    marginBottom: 15,
    marginTop: 20
  },
  carousel_img_cont:{

  },
  carousel_description:{
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.79)',
    borderRadius: 4,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  carousel_title:{
    color: '#fff',
    fontWeight: '500',
  },
  carousel_sub_title:{
    color: '#ddd',
    fontWeight: '100',
    fontSize: 10
  },
  bottom_tabs:{
    backgroundColor: '#EB64B0'
  },
  bottom_tabs_btns:{
    width: bottom_tabs_wid,  color: '#000', alignItems: 'center', textAlign: 'center'
  },
  icons: {

  },
  ListView:{

  },
  text: {
    marginLeft: 12,
    fontSize: 18
  },
  partner_address:{
    width: 380
  },
  photo: {
    height: 100,
    width: 120,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: 2, height: 1}
  },
  listing:{
     flex: 1,
     padding: 12,
     paddingBottom: 0,
     flexDirection: 'row',
     alignItems: 'center',
  },
  product_image_wrapper:{

  },
  product_image:{
     width: APP_WIDTH,
     height: 200
  },

  LoginForm:{
    padding:15
  },
  form_input:{
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 20,
    borderRadius: 30,
    overflow: 'hidden',
    color: '#000'
  },
  TextWrap:{
    border: 1,
    borderColor: '#999',
    backgroundColor:'rgba(255, 255, 255, 0.54)',
    marginTop: 20,
    borderRadius: 30,
    overflow: 'hidden'
  },
  LoginButton:{
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor:'#e91e63',
    borderRadius: 30,
    textAlign: 'center',
    color: '#fff',
    fontSize: 20,
    width: 150,
  },
  LoginButtonWrap:{
    marginTop: 20,
    alignSelf: 'center',
    width: 150,
    borderRadius: 30,
  },
  logoIcon:{
    width: 80,
    height: 30
  },
  browseCategory_wrap:{ backgroundColor: '#041D44', paddingTop:15, paddingBottom: 20   },
  browseCategory_title:{ textAlign: 'center', color: '#fff', fontSize: 13, marginBottom: 15 },
  browseCategory_col:{  width: browseCategory_col_width,   },
  browseCategory_img:{ width: browseCategory_col_wh, height: browseCategory_col_wh, borderRadius: 30, alignSelf: 'center', },
  browseCategory_desc:{ color: '#fff',  textAlign: 'center', marginTop: 5},

  home_banner_section:{ width: APP_WIDTH, height: home_banner_section_height, marginTop:5, },
  home_banner_section_img: { width: APP_WIDTH, height: home_banner_section_height },
  home_banner_section_txt_view: { width: APP_WIDTH,  position:'absolute', flex: 1, flexDirection: 'column', height: home_banner_section_height , justifyContent: 'center',  backgroundColor: 'rgba(0, 0, 0, 0.37)'},
  home_banner_section_txt: {fontSize: 24, color: '#fff', paddingLeft: 20, paddingRight: 20, },

  back_btn:{ position: 'absolute', left: 10, marginTop: 10, zIndex: 22, fontSize: 18, color: '#fff', backgroundColor: 'transparent' },

  product_content:{ paddingTop: 20 },
  product_name:{
    fontSize: 27,
    textAlign: 'center',
    fontWeight: '300',
  },
  product_location:{
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  product_hashtag:{
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '500',
    marginTop: 2,
    color: '#EB64B0'
  },
  product_seperator:{
    height: 1,
    width: (APP_WIDTH - 80),
    backgroundColor: '#ddd',
    marginTop: 5, marginBottom: 5,alignSelf: 'center',
  },
  product_timing:{alignSelf: 'center',  flexDirection: 'row', flexWrap:'wrap'},
  green_text:{ color: 'green', fontSize: 13},
  timing_text:{  fontSize: 13},
  product_col_icons:{ flexDirection: 'row', flexWrap:'wrap',alignSelf: 'center',   },
  product_col:{  },
  product_col_Icon:{  borderColor: '#686668', borderWidth: 2, textAlign: 'center', padding: 10, width: 50, height: 50, lineHeight: 25, fontSize: 22, margin: 5, color: '#686668'  },
  product_col_desc:{alignSelf: 'center', fontSize: 11 , color:'#E84DA4', width: 50, flexWrap: "wrap", textAlign: 'center'  },
  product_description:{ padding: 5 },
  product_description_title:{color:'#E84DA4',fontWeight: '500',fontSize: 15 , },
  product_description_title_center : {color:'#E84DA4',fontWeight: '500',fontSize: 15,textAlign:  'center', },
  product_description_para:{fontSize: 14 ,},
  product_bottom_cat_section:{flexDirection: 'row', flexWrap:'wrap',},
  product_bottom_cat:{
     width: APP_WIDTH/2, height: 110, marginTop:10,marginBottom: 15
  },
  product_bottom_cat_img: { width: '90%', height: 110,  marginLeft: '5%', borderRadius: 10  },
  product_bottom_cat_view: { width: '90%',  position:'absolute', flex: 1, flexDirection: 'column', height: 110 , justifyContent: 'center',  backgroundColor: 'rgba(0, 0, 0, 0.37)', marginLeft: '5%', borderRadius: 10 },
  product_bottom_cat_txt: {fontSize: 18, color: '#fff', paddingLeft:10, paddingRight: 10, textAlign: 'center' },

  product_listing_content:{ backgroundColor: '#fff',
   borderColor: '#ddd',width: '100%', marginLeft: '0%',
  borderBottomWidth: 1, borderTopWidth: 1, marginTop: '1%', marginBottom: '0.5%', paddingBottom: 10, paddingTop: 5, borderRadius: 4,
 },
  product_listing_content_top:{ paddingLeft: 10, paddingRight: 10, paddingBottom: 5 },
  product_listing_content_title:{  },
  product_listing_content_title_txt:{ fontSize: 23, color:'#000' },
  product_listing_content_txt2:{flexDirection: 'row', flexWrap:'wrap',},
  product_listing_content_reviews:{ width: '55%', color:'#374046'},
  product_listing_content_location:{ width: '42%', textAlign: 'right', color:'#000', fontSize : 11 },
  product_listing_content_middle:{},
  product_listing_content_img:{ width: '100%', height: (( APP_WIDTH * 416 ) / 780)  },
  offers_product_listing_content_img:{ width: '100%', height: (( APP_WIDTH * 473 ) / 1080)  },
  product_listing_content_bottom:{ paddingLeft: 10, paddingRight: 10, paddingTop: 5 },
  product_listing_content_bottom_time:{},
  product_listing_content_bottom_value:{},
  iconCommon:{ fontSize: 13, color:'#E29A0D' },
  product_listing_content_bottom_time:{ fontSize: 13 },
  product_listing_content_bottom_value:{ fontSize: 13 },

  box1: {
    flex: 1
  },
  container: {
    flex: 1,
    width: APP_WIDTH,
    backgroundColor: '#F5FCFF'
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
  topMenuTitle:{
    color:'#041e42',
    fontSize: 11,
    paddingLeft: 10,
    marginLeft:2
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
 productPage:{
   marginTop : 5
 },
 btnLogInText: {
    "color": "white",
    "fontWeight": "bold",
    "fontSize": 14
},
btnLogIn: {
    "alignItems": "center",
    "justifyContent": "center",
    "backgroundColor": "#E84EA4",
    "width": APP_WIDTH * 60/100,
    "paddingTop": 12,
    "paddingRight": 12,
    "paddingBottom": 12,
    "paddingLeft": 12,
    "marginBottom": 14,
    "borderRadius": 25
},
  product_bottom_cat_3:{
  "width": APP_WIDTH/3.1, "height": 110, "marginTop":10,"marginBottom": 15
  },
  product_bottom_cat_1:{
  "width": APP_WIDTH, "height": 110, "marginTop":10,"marginBottom": 15,"marginLeft": 3
  },
 browseCategory_img_avatar:{
  "width": browseCategory_col_wh,
   "height": browseCategory_col_wh,
    "borderRadius": browseCategory_col_wh,
     "alignSelf": 'left',
      },
 browseCategory_img_avatar_large:{
  "width": browseCategory_col_wh*2,
   "height": browseCategory_col_wh*2,
    "borderRadius": browseCategory_col_wh,
   "alignSelf": 'center',
   "marginTop" : 10,
    },

   product_description_body:{
    "color":'#000',
    "fontWeight": '500',
   "fontSize": 12 , },
   map_icon_home:{
     marginLeft: 10
   },
   usergallery_bottom_cat_3:{
    "width": APP_WIDTH/3.3, "height": ( (APP_WIDTH/3) * 840 ) / 700, "marginTop":5,"marginBottom": 5, marginLeft: 5, marginRight: 5
    },
    menuItem:{
      fontSize: 16,
      paddingTop: 5,
      paddingBottom: 5
    },
    menu_inner: {
      flex: 1,
      flexGrow: 1,
      justifyContent: 'flex-start',
      alignSelf: 'stretch',
      backgroundColor: '#F1F1F1',
      paddingLeft: 20,
      paddingRight: 15,
      paddingTop: 5,
      marginTop: 10
    },
    menuBg:{
      backgroundColor: '#F1F1F1',
    },
    profileMenuImg:{
      marginTop: 0, marginBottom: 0,  justifyContent: "center",
      width: '100%', height: 120, borderRadius: 2
    },
    profileMenuName:{
        justifyContent: "center", color: '#000', fontSize: 16,
    },
    profileWrapMenu:{
      flexDirection: 'column',
      paddingTop: 0,
      paddingLeft: 0,
      paddingBottom: 10,
      borderBottomWidth: 1,
      borderColor: '#959DA5',
      backgroundColor: '#fff'
    },
    page_title:{
      fontSize: 18
    },
    pageWrapper:{
      padding: 15,
    },
    pageWrapperContent:{
      lineHeight: 30,
      fontSize: 18,
    },
    pageTopImg:{
      width: "100%",
      height: 180
    },
    btn_2:{
      justifyContent: "center",
      "backgroundColor": "#041E42",
      "paddingTop": 12,
      "paddingRight": 12,
      "paddingBottom": 12,
      "paddingLeft": 12,
      "marginBottom": 14,
      "borderRadius": 25,
       width: (APP_WIDTH / 2)- 20,
       marginLeft: 10,
       marginRight: 10,
       alignItems: 'center'
    },

    slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5',
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9',
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },


};
