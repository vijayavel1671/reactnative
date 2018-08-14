import React from "react";
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  AsyncStorage,
  RefreshControl
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { SpinkitLarge, TabBarIcon } from "@components";
import { Languages, Style, Config, gAnalytics, Images } from "@common";
import { inject, observer } from "mobx-react";
import HTMLView from "react-native-htmlview";
import { Card, SocialIcon } from "react-native-elements";
import styles from "../../../styles";
import { ShareDialog } from "react-native-fbsdk";
import Share, { ShareSheet } from 'react-native-share';
import branch, { BranchEvent } from 'react-native-branch'

const APP_WIDTH = Dimensions.get('window').width;
slider_height = ((APP_WIDTH * 630) / 1680);

@inject("stores")
@observer
class BlogScreen extends React.Component {
  static navigationOptions = {
    title: "Blog",
    headerMode: "screen"
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      blog: [],
      animating: true,
      shareUrl: null,
      hideHome: false,
      paramId : null,
      editAllowed : null,
      token : null,
    };
    gAnalytics.trackScreenView('BlogPage');
  }

  componentWillMount() {
    let paramId = this.props.navigation.state.params.id;
    let editAllowed = this.props.navigation.state.params.editBlog ? this.props.navigation.state.params.editBlog : false; 

    this.setState({ animating: true , paramId : paramId,editAllowed:editAllowed }, () => {
          this.getUser();      
      this.getBlogbyId(paramId);
    });
  }

   getBlogbyId(id){
    this.props.stores.blog
      .getBlog(id)
      .then(res => {
        this.setState({ blog: res, animating: false , isFetching : false }, () => {
          this.handleAnalytics()
          /*Create Branch link*/
          this.createBranchUniversalObject()
          /*Create Branch link End*/
        });
      })
      .catch(err => console.log(err));
  }

  getUser(){
    AsyncStorage.getItem("usertoken")
      .then(item => {
        if (item) {
          this.setState({token:item})
          this.props.stores.user.getuserInfoBasic()
            .then(data => {
              let d = JSON.parse(data)
              gAnalytics.setUser(d.id.toString());
            }).catch(err => console.log(err))
        }
      }).catch(e => console.log(e))
  }

  handleAnalytics() {
    gAnalytics.trackEvent('blog', 'view', { name: 'BlogPage' });
    gAnalytics.trackEvent('blog', 'details', {
      id: this.state.blog.id,
      title: this.state.blog.title,
      store: this.state.blog.store_id ? this.state.blog.store_id : 'none'
    });
  }

  /* branch create new url */
  createBranchUniversalObject = async () => {
    try {
      let defaultBUO = {
        locallyIndex: true,
        title: 'Zingbi Blog',
        contentDescription: 'Zingbi Blog : ' + this.state.blog.title,
        contentMetadata: {
          customMetadata: {
            'navigation_type': 'Blog',
            'id': this.state.blog.id + ""
          }
        }
      }

      let result = await branch.createBranchUniversalObject('zingbiblog', defaultBUO)
      if (this.buo) this.buo.release()
      this.buo = result
      // console.log('createBranchUniversalObject>>>', result)
      this.generateShortUrl()
    } catch (err) {
      console.log('createBranchUniversalObject err', err.toString())
    }
  }

  generateShortUrl = async () => {
    if (!this.buo) await this.createBranchUniversalObject()
    try {
      let linkProperties = {
        feature: 'share',
        channel: 'All',
      }
      let controlParams = {
        $desktop_url: 'https://www.zingbi.com/blog/' + this.state.blog.id,
        $fallback_url: 'https://www.zingbi.com/blog/' + this.state.blog.id,
      }

      let result = await this.buo.generateShortUrl(linkProperties, controlParams)
      this.setState({ shareUrl: result.url })
    } catch (err) {
      console.log('generateShortUrl err', err)
    }
  }
  /* Branch create new url end */

  share = () => {
    let b = this.props.navigation.state.params.id;
    let shareOptions = {
      title: "Zingbi blog",
      url: this.state.shareUrl,
      type: 'image/png',
      subject: "Zingbi blog"//  for email
    };
    Share.open(shareOptions);

  }

  onRefresh(bid){
      this.setState({
        isFetching : true
      }, () => {
        this.getBlogbyId(bid);
      })
  }

  editRedirect = () => {
    if(this.state.token){
     /* id => is store id */
      this.props.navigation.navigate('UpdateBlog', { blogId: this.state.paramId, store_id : this.state.blog.store_id,
        token : this.state.token})
      }else{
        Alert.alert("You must log in to perform this action.")
      }
  }


  /* Home footer */
  onScrollEvent = (e) => {
    if (e.nativeEvent.contentOffset.y > 30) {
      this.setState({
        hideHome: true
      })
    } else {
      this.setState({
        hideHome: false
      })
    }
  }

  render() {
    if (!this.state.animating) {
      return (
        <View style={Style.container}>
          <View style={{flexDirection: 'row',flex:1, marginBottom:50}}>
          <ScrollView style={{ height: '100%' }} onScroll={this.onScrollEvent} 
            onMomentumScrollBegin={() => { this.setState({ hideHome: true }) }}
            onMomentumScrollEnd={() => { this.setState({ hideHome: false }) }}
            refreshControl={
              <RefreshControl
                onRefresh={() => this.onRefresh(this.state.blog.id)}
                refreshing={this.state.isFetching}
              />
            }>
            <View style={{ opacity: 1 }}>
              <Image
                style={{
                  flex: 1,
                  width: "100%",
                  height: slider_height
                }}
                source={{ uri: this.state.blog.image ? Config.BaseUrl + this.state.blog.image : Config.NoImageUrl }} />
            </View>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                alignItems: "center",
                width: "100%"
              }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                  color: "#000",
                  paddingLeft: 15,
                  marginTop: 15,
                  marginBottom: 15
                }}>
                {this.state.blog.title}
              </Text>
            </View>
            <View
              style={{
                justifyContent: "space-between",
                borderColor: "#eee",
                borderWidth: 1,
                flexDirection: "row",
                flexWrap: "wrap",
                backgroundColor: "#fff",
                marginTop: 0,
                overflow: "hidden",
                borderRadius: 50
              }}>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  flexWrap: "wrap",
                  alignItems: "center"
                }}>
                <View
                  style={{
                    borderColor: "#ddd",
                    borderWidth: 5,
                    width: 50,
                    borderRadius: 50,
                    overflow: "hidden"
                  }}>
                  <Image
                    style={{
                      width: 40,
                      height: 40,
                      resizeMode: "cover",
                      borderRadius: 40,
                      overflow: "hidden"
                    }}
                    source={{
                      uri:
                        this.state.blog.user_type == "user"
                          ? this.state.blog.user_pic
                            ? Config.BaseUrl + this.state.blog.user_pic
                            : Config.NoImageUrl
                          : this.state.blog.blogger_pic
                            ? Config.BaseUrl + this.state.blog.blogger_pic
                            : Config.NoImageUrl
                    }} />
                </View>

                <View style={{ width: "70%", flexDirection: "row" }}>
                  <Text style={{ fontSize: 12, marginLeft: 5 }}> By </Text>
                  {this.state.blog.user_type == "user" ? (
                    <View>
                      <Text
                        style={{
                          fontSize: 11,
                          marginLeft: 2,
                          fontWeight: "600"
                        }}>
                        {this.state.blog.user_name}{" "}
                      </Text>
                    </View>
                  ) : (
                      <View>
                        <Text
                          onPress={() =>
                            this.props.navigation.navigate("BloggerProfile", {
                              id: this.state.blog.blogger_id
                            })}
                          style={{
                            fontSize: 13,
                            marginLeft: 2,
                            fontWeight: "600"
                          }}>
                          {this.state.blog.blogger_name}
                          {this.state.blog.blogger_location
                            ? "," + this.state.blog.blogger_location
                            : null}
                        </Text>
                      </View>
                    )}
                </View>
              </View>
              {(this.state.blog.is_approved == 1 || this.state.blog.is_approved == '1')  ? <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                <TouchableOpacity style={{ marginRight: 10 }}
                  onPress={this.share}>
                  <Text
                    style={{
                      fontSize: 12,
                      marginRight: 5,
                      borderRadius: 15,
                      fontWeight: "600",
                      backgroundColor: "#041E42",
                      color: "#fff",
                      padding: 5
                    }}>
                    {" "}
                    <Icon name="share" size={15} color="#fff" /> Share{" "}
                  </Text>
                </TouchableOpacity>
              </View> : null }
              {(this.state.blog.is_approved == 1 || this.state.blog.is_approved == '1') && this.state.editAllowed ? <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                <TouchableOpacity style={{ marginRight: 10 }}
                  onPress={this.editRedirect}>
                  <Text
                    style={{
                      fontSize: 12,
                      marginRight: 5,
                      borderRadius: 15,
                      fontWeight: "600",
                      backgroundColor: "#041E42",
                      color: "#fff",
                      padding: 5
                    }}>
                    {" "}
                    <Icon name="edit" size={15} color="#fff" /> Edit{" "}
                  </Text>
                </TouchableOpacity>
              </View> : null}
            </View>

            <View style={{ padding: 20 }}>
              <HTMLView value={this.state.blog.body} stylesheet={htmlStyle} />
            </View>
            {this.state.blog.store_id ? (
              <TouchableOpacity
                style={{
                  width: "96%",
                  backgroundColor: "#E29A0D",
                  borderRadius: 3,
                  padding: 8,
                  paddingLeft: 10,
                  marginLeft: "2%",
                  marginBottom: 15
                }}
                onPress={() =>
                  this.props.navigation.navigate("Product", {
                    id: this.state.blog.store_id
                  })}>
                <Text
                  style={[
                    {
                      color: "#fff",
                      marginBottom: 0,
                      textAlign: "center"
                    }
                  ]}>
                  {'Visit Showcase'}
                </Text>
              </TouchableOpacity>
            ) : null}
          </ScrollView>
          </View>
          {/*
            !this.state.hideHome ?
              <View style={[Style.fixedFooter, {
                width: 50, height: 50,
                borderRadius: 100, right: '4%', bottom: '4%',
                flex: 1, flexDirection: 'row', justifyContent: 'flex-end'
              }]}>
                <TouchableOpacity style={Style.iconFixFooter} onPress={() => this.props.navigation.navigate('Main')}>
                  <TabBarIcon icon={Images.icons.news} tintColor={'#fff'} />
                </TouchableOpacity>
              </View> : null
          */}
		  
		  <View style={[Style.fixedFooter, { bottom: 0, flex: 1, flexDirection: 'row', justifyContent: 'flex-end'  }] }>
						<TouchableOpacity style={Style.iconFixFooter} onPress={() => this.props.navigation.navigate('Main')}>
						  <TabBarIcon icon={Images.icons.news} tintColor={'#fff'} />
						</TouchableOpacity>
						<TouchableOpacity style={Style.iconFixFooter} onPress={() => this.props.navigation.navigate('Designers')}>
						  <TabBarIcon icon={Images.icons.user} tintColor={'#fff'} />
						</TouchableOpacity>
						<TouchableOpacity style={Style.iconFixFooter} onPress={() => this.props.navigation.navigate('Favorites')}>
						  <TabBarIcon icon={Images.icons.star} tintColor={'#fff'} />
						</TouchableOpacity>
					  </View>
		  
        </View>
      );
    } else {
      return <SpinkitLarge />;
    }
  }
}

const htmlStyle = StyleSheet.create({
  p: {
    fontSize: 18,
    lineHeight: 18
  },
  strong: {
    fontWeight: "600"
  }
});

export default BlogScreen;


/*
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                <TouchableOpacity style={{ marginRight: 10 }}
                  onPress = {this.share}>
                  <Text
                    style={{
                      fontSize: 12,
                      marginRight: 5,
                      borderRadius: 15,
                      fontWeight: "600",
                      backgroundColor: "#041E42",
                      color: "#fff",
                      padding: 5
                    }}>
                    {" "}
                    <Icon name="share" size={15} color="#fff" /> Share{" "}
                  </Text>
                </TouchableOpacity>
              </View>*/
