/* @flow */
import React, { Component } from "react";
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  ScrollView,
  Image,
  Easing,
  WebView,
  Linking,
  AsyncStorage,
  Platform,
  ToastAndroid,
  Animated
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import NavigationBar from "react-native-navbar";
import styles_main from "../../../styles";
import { TabBarIcon, SpinkitLarge } from "@components";
import { Images, Config, Style, gAnalytics } from "@common";
import Swiper from "react-native-deck-swiper";
import { inject, observer } from "mobx-react";
import css from '../Forms/style';
import HTMLView from "react-native-htmlview";
import moment from 'moment';

const APP_WIDTH = Dimensions.get('window').width;
slider_height = ((APP_WIDTH * 362) / 640);


@inject("stores")
@observer
export default class WhoWhatWearScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: [],
      swipedAllCards: false,
      swipeDirection: "",
      isSwipingBack: false,
      cardIndex: 0,
      animating: true,
      notfound: false,
      fadeAnim: new Animated.Value(0),
    };

    gAnalytics.trackScreenView('WhoWhatWearPage')
  }

  static navigationOptions = {
    title: "Who What Wear",
    headerMode: "screen"
  };

  renderNode(node, index, siblings, parent, defaultRenderer) {
    if (node.name == 'img') {
      const a = node.attribs;
      return (<Image style={{ width: 300, height: 250 }} source={{ uri: a.src }} />);
    } else if (node.name == 'readmore'){
        console.log(node.src);
        
    }
  }

  componentWillMount() {
    this.props.stores.misc
      .getArticles()
      .then(result => {
        if (result.status == 'success') {
          if (result.www.length == 0) {
            this.setState({
              notfound: true,
              animating: false
            })
          } else {
            this.setState({ cards: result.www, animating: false }, () => {
            //  console.log(this.state.cards)
              this.handleAnalytics()
            });
          }
        } else {
          this.setState({ cards: [], animating: false });
        }
      })
      .catch(error => console.log(error));
  }

  handleAnalytics() {
    AsyncStorage.getItem("usertoken")
      .then(item => {
        if (item) {
          this.props.stores.user.getuserInfoBasic()
            .then(data => {
              let d = JSON.parse(data)
              gAnalytics.setUser(d.id.toString());
            }).catch(err => console.log(err))
        }
        gAnalytics.trackEvent('whowhatwear', 'view',
          { name: 'WhoWhatWearPage' });
      }).catch(e => console.log(e))
  }

  handleUrl(link) {
    Linking.canOpenURL(link).
      then(supported => {
        if (!supported) {
          console.log('Can\'t handle url: ' + link);
        } else {
          return Linking.openURL(link);
        }
      })
      .catch(err => console.error('An error occurred', err));
  }


  handleTouch(cat, id) {
    const { navigate } = this.props.navigation;
    if (cat == 'offer') {
      navigate("OfferDetail", { offerid: id })
    } else if (cat == 'article' || cat == 'fashion_tips' || cat == 'event') {
      /* Better atype name */
      if (cat == 'article') {cat = 'Article' } else if (cat == 'fashion_tips') {cat = 'Fashion Tips' } else if (cat == 'event'){cat = 'Event'}

      navigate('WhoWhatWearDetail', { articleid: id, atype: cat })
    } else if (cat == 'blog') {
      navigate('Blog', { id: id })
    } else {
      console.log("New Type :" + cat)
    }
    // this.props.navigation.navigate('WhoWhatWearDetail',{articleid : id,atype : cat})
  }

  renderCard = card => {
    // let desc = null;
    // if (card.description){
    //   desc = card.description + '<readmore>Read More</readmore>';
    // }
    return (
      <View style={[styles.card, { flex: 1, }]}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => console.log("noc")}
          key={card.id}
          style={[{ flex: 0.9, flexDirection: 'column' }]}>
          <Image
            style={[styles.news_feed_img, styles.who_what_wear_img]}
            source={{
              uri: card.mobile_image ? Config.BaseUrl + card.mobile_image : Config.NoImageUrl
            }} />

          <View style={styles.inner_view_card}>
            {card.title ?
              <View style={[styles_main.product_listing_content_txt2]}>
                <Text style={styles.news_feed_title}>{card.title}</Text>
              </View> : null
            }
            {
              card.type == 'event' ?
                (<View>
                  {card.start_date ?
                    (<Text style={[{ fontSize: 14, fontWeight: '500' }]}>
                      {'Start Date : '}{moment(card.start_date).format('DD/MM/YYYY')}{" "}</Text>)
                    : null}
                  {
                    card.end_date ?
                      (<Text style={[{ fontSize: 14, fontWeight: '500' }]}>
                        {'End Date : '}{moment(card.end_date).format('DD/MM/YYYY')}{" "}</Text>)
                      : null
                  }
                  {
                    card.end_time !== "" && card.start_time !== "" ?
                      (<Text style={[{ fontSize: 14, fontWeight: '500' }]}>
                        {'From '}{card.start_time} {' To '} {card.end_time}</Text>) : null
                  }
                  {
                    card.location ?
                      (<Text style={[{ fontSize: 14, fontWeight: '500' }]}>{'Location : '}{card.location}</Text>)
                      : null
                  }

                </View>
                ) : null
            }
            <View style={styles_main.product_listing_content_txt2}>
              {
                card.description ?
                  (<View style={{ flex: 1 }}>
                    <Text style={{ fontSize:15,lineHeight:23 }} >
                      {card.description.replace(/&nbsp;/g, " ")}
                      <Text
                        onPress={() => this.handleTouch(card.type, card.refrence_id)}
                        style={{ fontSize: 16, fontWeight: '500', }}>
                        {'Read More'}
                      </Text>
                    </Text>
                  </View>)
                  : null
              }
            </View>
          </View>
        </TouchableOpacity>
        {
          card.url ?
            <TouchableOpacity onPress={() => this.handleUrl(card.url)}
          activeOpacity={0.9}
          style={[Style.darkButton,{ bottom:70,width:'95%',alignSelf:'center' }
            ]} >
          <Text style={[Style.darkButtonTxt, { fontSize: 13 }]} >View More</Text>
        </TouchableOpacity> : null
      }
      </View>
    );
  };

  /* <HTMLView value={card.description} stylesheet={[styles, { fontSize: 19 }]} renderNode={this.renderNode} />
   */

  onSwipedAllCards = () => {
    this.setState({
      swipedAllCards: true
    }, () => {
      Animated.timing(                  // Animate over time
        this.state.fadeAnim,            // The animated value to drive
        {
          toValue: 1,                   // Animate to opacity: 1 (opaque)
          duration: 500,              // Make it take a while
        }
      ).start();
    });
  };

  swipeBack = () => {
    if (!this.state.isSwipingBack) {
      this.setIsSwipingBack(true, () => {
        this.swiper.swipeBack(() => {
          this.setIsSwipingBack(false);
        });
      });
    }
  };

  setIsSwipingBack = (isSwipingBack, cb) => {
    console.log("Debugging")
    console.log("isSwipingBack", isSwipingBack)
    console.log("cb", cb)
    this.setState(
      {
        isSwipingBack: isSwipingBack
      },
      cb
    );
  };

  onSwipedB = (index) => {
    if (index == 0) {
      this.setIsSwipingBack(false);
    }
  }

  jumpTo = () => {
    // this.swiper.swipeLeft();
    console.log("tapped")
  };

  render() {
    if (this.state.animating) {
      return (<SpinkitLarge />)
    } else {
      if (this.state.notfound) {
        return (
		
          <View style={styles.container}>
            <Text style={{ marginTop: 15, textAlign: 'center', fontWeight: '500' }}>
              {'No results found. Come back later!'}
            </Text>
			
			<View style={Style.fixedFooter}>
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
        )
      } else if (this.state.swipedAllCards) {
        return (
		<View style={styles.container}>
          <Animated.View style={{
            ...this.props.style,
            opacity: this.state.fadeAnim,         // Bind opacity to animated value
          }}>
            <Text style={{ marginTop: 15, textAlign: 'center', fontWeight: '500', fontSize: 20 }}>
              {'All done!'}</Text>
            <View style={css.wrapButton}>
              <TouchableOpacity
                style={[css.btnLogIn, { height: 35, elevation: 8 }]}
                onPress={() => this.props.navigation.goBack()}>
                <Text style={css.btnLogInText}>
                  {" "}{'Go Back'}{" "}
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
		  
		  <View style={Style.fixedFooter}>
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
        )
      } else {
        return (
          <View style={styles.container}>
		
			<View style={{flexDirection: 'row',flex:1, marginBottom:50}}>
		
            <Swiper
			 
              ref={swiper => {
                this.swiper = swiper;
              }}
              horizontalSwipe={false}
              onSwipedBottom={() => false}
              onSwipedTop={() => false}
              onSwiped={() => false}
              onTapCard={this.jumpTo}
              cards={this.state.cards}
              infinite={false}
              showSecondCard={false}
              goBackToPreviousCardOnSwipeBottom={true}
              cardIndex={this.state.cardIndex}
              cardVerticalMargin={0}
              renderCard={this.renderCard}
              onSwipedAll={this.onSwipedAllCards}
              cardHorizontalMargin={0}
              disableLeftSwipe={true}
              disableRightSwipe={true}
              backgroundColor={'#f0f0f0'}
              overlayLabelStyle={{
                fontSize: 15,
                fontWeight: "bold",
                borderRadius: 10,
                overflow: "hidden",
              }}
              animateOverlayLabelsOpacity
              animateCardOpacity
            />
			
			</View>
			
			
			<View style={Style.fixedFooter}>
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
      }
    }
  }
}

who_what_wear_img_height = ((250 * 960) / 800);

const styles = StyleSheet.create({
  box1: {
    flex: 1
  },
  container: {
    flex: 1
  },
  card: {
    flex: 1,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#E8E8E8',
    backgroundColor: 'white',
  },
  inner_view_card: {
    padding: 15
  },
  text: {
    textAlign: "center",
    fontSize: 10,
    backgroundColor: "transparent"
  },
  done: {
    textAlign: "center",
    fontSize: 11,
    color: "white",
    backgroundColor: "transparent"
  },
  news_feed_img: {
    height: slider_height,
    width: '100%',
    alignSelf: 'center',
    borderRadius: 8
  },
  news_feed_title: {
    fontSize: 21,
    marginBottom: 8
  },
  p: {
    fontSize: 14
  }
});
