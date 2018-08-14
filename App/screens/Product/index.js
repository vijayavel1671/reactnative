import React from "react";
import {
    View,
    Text,
    Button,
    TouchableOpacity,
    Image,
    ScrollView,
    StatusBar,
    AsyncStorage,
    ToastAndroid,
    Platform,
    Linking,
    Alert,
    Dimensions,
    StyleSheet,
    ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Accordion from 'react-native-collapsible/Accordion';
import { Languages, Style, Config, Color, gAnalytics, Images } from "@common";
import { inject, observer } from "mobx-react";
import { SpinkitLarge, TabBarIcon } from "@components";
import HTMLView from "react-native-htmlview";
import Share, { ShareSheet } from 'react-native-share';
import moment from 'moment';

import Carousel from 'react-native-looped-carousel';
// Import branch and BranchEvent
import branch, { BranchEvent } from 'react-native-branch'
/*Import modules for showcase*/
import StoreCollections from './StoreCollections';

const baseUrl = Config.BaseUrl;
const APP_WIDTH = Dimensions.get('window').width;
slider_height = ((APP_WIDTH * 416) / 780);


let width_of_offers = (APP_WIDTH * 0.95) * (0.95);
let height_of_offers = (width_of_offers * 170) / 640;


let width_of_container_with_padding = (APP_WIDTH * 0.95);
let cal_width = width_of_container_with_padding * 0.95;
let explore_gallery_width = cal_width * 0.48;
let explore_gallery_thumb_height = (explore_gallery_width * 260) / 466;


let OffersImage = 'https://s3.ap-south-1.amazonaws.com/zingbi/static/offers.jpg'
let StoreGalleryImage = 'https://s3.ap-south-1.amazonaws.com/zingbi/static/storegallery.jpg'
let UserGalleryImage = 'https://s3.ap-south-1.amazonaws.com/zingbi/static/usergallery.jpg'

@inject("stores")
@observer
class ProductScreen extends React.Component {
    buo = null

    static navigationOptions = {
        headerMode: "screen"
    };

    constructor(props, context) {
        super(props, context);
        this.state = {
            position: 0,
            interval: null,
            store: [],
            sliderLength: 0,
            sliderImages: [],
            presentStore: false,
            animating: true,
            selected_bn: false,
            selected_bm: false,
            usertoken: "",
            store_blogs: [],
            addmoreblogCount: 1,
            storeid: null,
            blogsDone: false,
            beenhere_count: null,
            share_visible: false,
            faqs: [],
            shareUrl: null,
            loadmorerequired: true,
            imageLoad: true,
            notfound: false,
            hideHome: false,
        };
        this.handleCPNavigation = this.handleCPNavigation.bind(this)
        gAnalytics.trackScreenView('StorePage')
    }

    componentWillMount() {
        this.setState({ animating: true })
        /*Check if user is logged in...*/
        AsyncStorage.getItem("usertoken")
            .then(item => {
                if (item) {
                    this.setState({ usertoken: item }, () => {
                        this.props.stores.user.getuserInfoBasic()
                            .then(data => {
                                let d = JSON.parse(data)
                                gAnalytics.setUser(d.id.toString());
                            }).catch(err => console.log(err))
                    });
                }

                gAnalytics.trackEvent('store', 'view', { name: 'StorePage' });
            })
            .catch(err => console.log(err));

        let paramId = this.props.navigation.state.params.id;
        this.setState({ storeid: paramId })
        this.props.stores.partner
            .getPartnerData(paramId)
            .then(result => {
                if (result.status == 'fail') {
                    this.setState({ notfound: true, animating: false })
                } else {
                    this.setState({
                        store: result,
                        presentStore: true,
                        beenhere: false,
                        beenhere_count: result.store.beenhere,
                        animating: false,
                    }, () => {
                        /*Create Branch link*/

                        this.createBranchUniversalObject()

                        /*Create Branch link End*/

                        if (result.store.bookmark_status == 1 ||
                            result.store.bookmark_status == "1") {
                            this.setState({ selected_bm: true });
                        }

                        if (result.store.beenhere_status == 1 ||
                            result.store.beenhere_status == "1") {
                            this.setState({ selected_bn: true });
                        }
                        /*setting slider blogs*/
                        if (result.store_blogs.length > 0) {

                            this.setState({
                                store_blogs: result.store_blogs,
                                totalStoreBlogs: result.store_blog_count,
                            }, () => {
                                if (this.state.totalStoreBlogs < 4) {
                                    this.setState({
                                        blogsDone: true
                                    })
                                }
                            })
                        }
                        /*Setting slider images*/
                        var slidersArr = [];

                        if (result.mobile_slider_images.length > 0) {
                            for (var i = 0; i < result.mobile_slider_images.length; i++) {
                                slidersArr.push(
                                    Config.BaseUrl + result.mobile_slider_images[i].image
                                );
                            }
                            this.setState({
                                sliderImages: slidersArr,
                                sliderLength: result.mobile_slider_images.length
                            });
                        } else {
                            if (result.store.logo_image) {
                                this.setState({
                                    sliderImages: [Config.BaseUrl + result.store.logo_image]
                                });
                            }
                        }

                        if (this.state.store.store_faq.length > 0) {
                            this.state.store.store_faq.map(item => {
                                this.state.faqs.push({ title: item.question, content: item.answer })
                            })
                        }



                        /* Roll slider */
                        setTimeout(() => {
                            this.setState({ imageLoad: false })
                        }, 500);
                    });
                }

            })
            .catch(error => {
                console.log(error);
            });
    }

    // async componentDidMount(){
    //     let rewards = await branch.loadRewards(bucket)
    //     console.log(rewards);
        
    // }
    _renderHeaderAcc(section) {
        return (
            <View style={{ paddingTop: 15, paddingBottom: 15, borderBottomWidth: 1, borderColor: '#ddd', marginBottom: 10 }}>
                <Text
                    style={{
                        color: "#000",
                        fontWeight: "500",
                        fontSize: 16,
                        textAlign: "left",
                    }}>
                    {"\u203A"}
                    {" Question : "}
                    <Text>{section.title}</Text>
                </Text>
            </View>
        );
    }

    _renderContentAcc(section) {
        return (
            <View>
                <Text
                    style={{
                        color: "#000",
                        fontWeight: "500",
                        fontSize: 16,
                        textAlign: "left",
                        marginBottom: 10
                    }}>
                    {" Answer : "}
                    <Text>{section.content}</Text>
                </Text>
            </View>
        );
    }

    /*--------------------------------------------Handlle been here--------------------------------------------*/
    handeBeenHere(store_id) {
        this.state.selected_bn
            ? this.handleBeenLocal(store_id, this.state.usertoken, "remove")
            : this.handleBeenLocal(store_id, this.state.usertoken, "add");
    }

    handleBeenLocal(id, token, action) {
        if (token.length > 0) {
            this.props.stores.partner
                .beenherePartner(id, token, action)
                .then(res => {
                    if (action == "add") {
                        if (res.status == "success") {
                            this.setState({ beenhere_count: this.state.beenhere_count + 1, selected_bn: true }, () => {
                                gAnalytics.trackEvent('store', 'beenhere', { type: 'add', storeid: id });
                            });
                        } else {
                            this.setState({ selected_bn: false });
                        }
                    } else if (action == "remove") {
                        if (res.status == "success") {
                            this.setState({ beenhere_count: this.state.beenhere_count - 1, selected_bn: false }, () => {
                                gAnalytics.trackEvent('store', 'beenhere', { type: 'remove', storeid: id });
                            });
                        } else {
                            this.setState({ selected_bn: true });
                        }
                    } else {
                        this.setState({ selected_bn: false });
                    }
                })
                .catch(error => console.log(error));
        } else {
            if (Platform.OS === "android") {
                ToastAndroid.show("You are not logged in", ToastAndroid.SHORT);
            } else {
                Alert.alert("You are not logged in")
            }
        }
    }


    handleFeedback() {
        if (this.state.usertoken) {
            this.props.navigation.navigate('Feedback', { token: this.state.usertoken, storeid: this.state.store.store.id })
        } else {
            if (Platform.OS === "android") {
                ToastAndroid.show("You are not logged in", ToastAndroid.SHORT);
            } else {
                Alert.alert("You are not logged in")
            }
        }
    }


    /*--------------------------------------------Handlle been here End--------------------------------------------*/
    /*------------------------------------------handle bookmark--------------------------------------*/
    handleBookmark(store_id) {
        this.state.selected_bm
            ? this.handleBmLocal(store_id, this.state.usertoken, "remove")
            : this.handleBmLocal(store_id, this.state.usertoken, "add");
    }

    handleBmLocal(id, token, action) {
        if (token.length > 0) {
            this.props.stores.partner
                .bookmarkPartner(id, token, action)
                .then(res => {
                    if (action == "add") {
                        if (res.status == "success") {
                            this.setState({ selected_bm: true }, () => {
                                gAnalytics.trackEvent('store', 'favorite', { type: 'add', storeid: id });
                            });
                        } else {
                            this.setState({ selected_bm: false });
                        }
                    } else if (action == "remove") {
                        if (res.status == "success") {
                            this.setState({ selected_bm: false }, () => {
                                gAnalytics.trackEvent('store', 'favorite', { type: 'remove', storeid: id });
                            });
                        } else {
                            this.setState({ selected_bm: true });
                        }
                    } else {
                        this.setState({ selected_bm: false });
                    }
                })
                .catch(error => console.log(error));
        } else {
            if (Platform.OS === "android") {
                ToastAndroid.show("You are not logged in", ToastAndroid.SHORT);
            } else {
                Alert.alert("You are not logged in")
            }
        }
    }
    /*------------------------------------------handle bookmark Remove--------------------------------------*/

    /*Set new appointment*/
    _setAppointment(storeid) {
        let tkn = this.state.usertoken;
        if (tkn.length > 0) {
            this.props.navigation.navigate("NewAppointment", {
                id: storeid,
                token: tkn,
                open_time : this.state.store.store.store_open_time,
                close_time : this.state.store.store.store_close_time
            });
        } else {
            if (Platform.OS === "android") {
                ToastAndroid.show("You are not logged in", ToastAndroid.SHORT);
            } else {
                Alert.alert("You are not logged in");
            }
        }
    }

    _handleBlog(storeid) {
        let tkn = this.state.usertoken;
        if (tkn.length > 0) {
            this.props.navigation.navigate("BlogIt", {
                id: storeid,
                token: tkn,
                storename: this.state.store.store.store_name
            });
        } else {
            Alert.alert('Blog It',
                'You must be logged in to perform this action.',
                [
                    { text: 'Cancel', onPress: () => this.props.navigation.goBack(), style: 'cancel' },
                    {
                        text: 'LOG IN',
                        onPress: () => this.props.navigation.navigate('Initial')
                    },],
                { cancelable: false })
        }
    }

    handleCPNavigation(collectionid) {
        this.props.navigation.navigate("StoreProductCollection", {
            cid: collectionid,
            storename: this.state.store.store.store_name
        })
    }

    /*------------------------------------Comparing shop status-----------------------------------*/
    CheckStatusShop(start, end) {
        var startTime = start;
        var endTime = end;
        var now = new Date();

        var startDate = this.dateObj(startTime); // get date objects
        var endDate = this.dateObj(endTime);

        if (startDate > endDate) {
            // check if start comes before end
            var temp = startDate; // if so, assume it's across midnight
            startDate = endDate; // and swap the dates
            endDate = temp;
        }

        var open_status = now < endDate && now > startDate ? "open" : "closed"; // compare

        if (open_status == "open") {
            return true;
        } else {
            return false;
        }
    }

    /*----------------------------Date formatter----------------------------------------------*/
    dateObj(d) {
        // date parser ...
        var parts = d.split(/:|\s/),
            date = new Date();
        if (parts.pop().toLowerCase() == "pm") parts[0] = +parts[0] + 12;
        date.setHours(+parts.shift());
        date.setMinutes(+parts.shift());
        return date;
    }

    componentWillUnmount() {
        // if (!this.buo) return
        // this.buo.release()
        clearInterval(this.state.interval);
    }

    createBranchUniversalObject = async () => {
        try {
            let defaultBUO = {
                locallyIndex: true,
                title: 'Zingbi Showcase',
                contentDescription: 'Zingbi Showcase Page : ' + this.state.store.store.store_name,
                contentMetadata: {
                    customMetadata: {
                        'navigation_type': 'Product',
                        'name': this.state.store.store.store_name,
                        'id': this.state.store.store.id + ""
                    }
                }
            }

            let result = await branch.createBranchUniversalObject('zingbistore', defaultBUO)
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
                $desktop_url: 'https://www.zingbi.com/store/' + this.state.store.store.id,
                $fallback_url: 'https://www.zingbi.com/store/' + this.state.store.store.id,
            }

            let result = await this.buo.generateShortUrl(linkProperties, controlParams)
            this.setState({ shareUrl: result.url })
        } catch (err) {
            console.log('generateShortUrl err', err)
        }
    }
    /*---------------------------Share button-------------------------------------*/
    shareStore = () => {
        let event = new BranchEvent(BranchEvent.Share, { type: 'Store', id: this.state.store.store.id })
        event.logEvent()

        let shareOptions = {
            title: "Zingbi",
            url: this.state.shareUrl ? this.state.shareUrl : 'https://www.zingbi.com/store/' + this.state.store.store.id,
            type: 'image/png',
            subject: "Zingbi Store" //  for email
        };
        Share.open(shareOptions);
    };

    /*--------------------__Near me---------------------------*/
    handleNearMe = () => {
        this.props.navigation.navigate("NearMe", {
            storeid: this.state.store.store.id, camefrom: 'store',
            latitude: this.state.store.store.latitude, longitude: this.state.store.store.longitude
        })
    }

    /*--------------------------------Near me end---------------------------------*/

    /*------------ADD MORE BLOGS----------------*/
    handleMoreBLogs = () => {
        this.setState({
            addmoreblogCount: this.state.addmoreblogCount + 1
        }, () => {
            this.props.stores.partner.LoadMoreBlogs(this.state.storeid, this.state.addmoreblogCount)
                .then(res => {
                    if (res.status == "success") {
                        if (res.store_blogs.length < 2) {
                            this.setState({ blogsDone: true })
                        }
                        this.setState({ store_blogs: [...this.state.store_blogs, ...res.store_blogs] })
                    } else {
                        this.setState({ blogsDone: true })
                    }
                })
                .catch(err => console.log(err))
        }
        )
    }
    /*---------------ADD MORE BLOGS END--------------*/

    /*-----------------------call0----------------------------------------------*/
    _call(no) {
        const url = "tel:" + no;
        Linking.canOpenURL(url)
            .then(supported => {
                if (!supported) {
                    console.error("Can't handle url: " + url);
                } else {
                    Alert.alert(
                        "Call " + this.state.store.store.store_name,
                        "Do you want to call the store ?",
                        [
                            {
                                text: "Cancel",
                                onPress: () => console.log("Cancel Pressed"),
                                style: "cancel"
                            },
                            {
                                text: "Call",
                                onPress: () =>
                                    Linking.openURL(url)
                                        .then(data => {
                                            gAnalytics.trackEvent('store', 'call', { no: no });
                                        })
                                        .catch(err => {
                                            throw err;
                                        })
                            }
                        ],
                        { cancelable: false }
                    );
                }
            })
            .catch(err => console.error("An error occurred", err));
    }
    /*-----------------------call end----------------------------------------------*/
    _locate = (lat, long) => {
        let url = "https://www.google.com/maps?saddr=My+Location&daddr=" + lat + "," + long + "";
        Alert.alert(
            this.state.store.store.store_name,
            this.state.store.store.address1 + " " + (this.state.store.store.address2 ? this.state.store.store.address2 : ''),
            [
                { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                {
                    text: 'Direction', onPress: () => {
                        Linking.canOpenURL(url)
                            .then(supported => {
                                if (!supported) {
                                    console.error("Can't handle url: " + url);
                                } else {
                                    Linking.openURL(url)
                                        .then(data => {
                                            gAnalytics.trackEvent('store', 'locate', { storeid: this.state.store.store.id });
                                        })
                                        .catch(err => {
                                            throw err;
                                        });
                                }
                            })
                            .catch(err => console.error("An error occurred", err));
                    }
                },
            ],
            { cancelable: false }
        )
    }

    _onLayoutDidChange = (e) => {
        const layout = e.nativeEvent.layout;
        this.setState({ size: { width: layout.width, height: layout.height } });
    }

    onScrollEvent = (e) => {
        if (e.nativeEvent.contentOffset.y > 20) {
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
        const { state, navigate } = this.props.navigation;
        if (this.state.animating) {
            return (<SpinkitLarge />)
        } else {
            if (this.state.notfound) {
                return (
				
				<View style={[Style.Container]}>
                    <View style={{ justifyContent: 'center' }} >
                        <Text style={{ marginTop: 30, fontSize: 20, fontWeight: '500', textAlign: 'center' }} >{"Store not found"}</Text>
                        <TouchableOpacity
                            style={{
                                width: '50%',
                                backgroundColor: '#808080',
                                borderRadius: 3,
                                padding: 8,
                                paddingLeft: 10,
                                marginTop: '3%',
                                marginLeft: '4%',
                                alignSelf: 'center'
                            }}
                            onPress={() =>
                                this.props.navigation.dispatch({
                                    type: "Navigation/BACK",
                                    index: 0,
                                    actions: [
                                        {
                                            type: "Navigate",
                                            routeName: "Listing"
                                        }
                                    ]
                                })}>
                            <Text
                                style={[Style.product_description_title_center_bottom, {
                                    color: '#fff',
                                    marginBottom: 0,
                                    textAlign: 'center'
                                }]}>
                                {" "}
                                <Icon
                                    name="chevron-left"
                                    size={20}
                                    color="#fff"
                                />{"    "}
                                {'Go back'}
                            </Text>
                        </TouchableOpacity>
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
				
                )
            } else {
                return (
                    <View style={[Style.Container, { marginTop: Platform.OS == 'ios' ? 24 : 0 }]}>
                        <ScrollView style={[Style.productPage, { backgroundColor: '#fff',marginBottom:45 }]} onMomentumScrollBegin={() => { this.setState({ hideHome: true }) }}
                            onMomentumScrollEnd={() => { this.setState({ hideHome: false }) }}>
                            <Icon
                                style={[Style.back_btn, { top: (Platform.OS === 'ios') ? 10 : 0, left: 10, padding: 10, backgroundColor: 'transparent' }]}
                                name="chevron-left"
                                onPress={() =>
                                    this.props.navigation.dispatch({
                                        type: "Navigation/BACK",
                                        index: 0,
                                        actions: [
                                            {
                                                type: "Navigate",
                                                routeName: "Listing"
                                            }
                                        ]
                                    })} />

                            <View style={Style.ViewImageSlider}>
                                {
                                    !this.state.sliderImages.length ? (
                                        <View style={{
                                            height: ((APP_WIDTH * 416) / 780),
                                            width: APP_WIDTH,
                                            flex: 1,
                                            backgroundColor: '#424242',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignContent: 'center'
                                        }}>
                                            <Text style={{ textAlign: 'center', color: '#fff', fontSize: 20 }} > {this.state.store.store.store_name} </Text>
                                        </View>
                                    ) : (
                                            <View style={{ flex: 1 }} onLayout={this._onLayoutDidChange} >
                                                <Carousel
                                                    delay={4000}
                                                    style={{ height: ((APP_WIDTH * 416) / 780), width: APP_WIDTH }}
                                                    autoplay
                                                    bullets
                                                    onAnimateNextPage={(p) => { }}>
                                                    {
                                                        this.state.sliderImages.map(image => {
                                                            return (
                                                                <Image
                                                                    source={{ uri: image }}
                                                                    style={{ height: ((APP_WIDTH * 416) / 780), width: APP_WIDTH }}
                                                                />
                                                            )
                                                        })
                                                    }
                                                </Carousel>
                                            </View>
                                        )
                                }

                                <TouchableOpacity
                                    style={[
                                        Style.product_star_favourite,
                                        this.state.selected_bm
                                            ? Style.selectedAttribute
                                            : Style.deSelectedAttribute]}
                                    activeOpacity={0.9}
                                    onPress={() =>
                                        this.handleBookmark(
                                            this.state.store.store.id
                                        )}>
                                    <Icon
                                        name="star"
                                        style={[
                                            Style.product_icon_white,
                                            Style.borderZero,
                                            this.state.selected_bm
                                                ? Style.selectedIcon
                                                : Style.deSelectedIcon
                                        ]}
                                    />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => { Alert.alert("Chat coming soon") }}
                                    style={[
                                        Style.product_comment_icon,
                                        Style.deSelectedAttribute
                                    ]}>
                                    <Icon
                                        style={[
                                            Style.product_icon_white,
                                            Style.deSelectedIcon,
                                            { fontSize: 12 }
                                        ]}
                                        name="comment"
                                    />
                                </TouchableOpacity>
                            </View>


                            <View style={[Style.product_content]}>
                                <Text style={Style.product_name}>
                                    {this.state.store.store.store_name}
                                </Text>
                                <Text style={Style.product_location}>
                                    {this.state.store.store.locality_id} ,{" "}
                                    {this.state.store.store.city_name}
                                </Text>
                                <Text style={Style.product_hashtag}>
                                    {this.state.store.store.hashtag}
                                </Text>

                                <View style={[Style.product_seperator]} />

                                {/*  Shop status */}
                                {this.state.store.store.store_open_time && this.state.store.store.store_close_time ?
                                    (this.state.store.store.store_open_time != this.state.store.store.store_close_time ?
                                        <View style={[Style.product_timing]}>
                                            <Text style={[Style.green_text, {
                                                color:
                                                    this.state.store.store.open_status == 'Closed' ? 'red' : 'green'
                                            }]}>
                                                {this.state.store.store.open_status} now - {" "}
                                            </Text>
                                            <Text style={Style.timing_text}>
                                                {this.state.store.store.store_open_time}{" "}
                                                to{" "}
                                                {this.state.store.store.store_close_time}
                                            </Text>
                                        </View> : null
                                    ) : null
                                }

                                {/*Closed days*/}
                                {
                                    this.state.store.store.closed_days ? (
                                        <View style={[Style.product_timing]}>
                                            <Text style={Style.timing_text}>
                                                {'Closed on'} - {" "}
                                            </Text>
                                            <Text style={Style.timing_text}>
                                                {this.state.store.store.closed_days}{" "}
                                            </Text>
                                        </View>
                                    ) : null
                                }

                                {/*Count of reviews,been here...*/}
                                <View style={[Style.product_timing]}>
                                    <Text style={Style.timing_text}>
                                        {this.state.store.store.reviews} {'blogs'}
                                    </Text>
                                    <Text style={Style.timing_text}>
                                        {","} {this.state.beenhere_count} {'been here'}
                                    </Text>
                                </View>

                                {/* -------------------------------------------------------------------------------*/}
                                <View style={Style.product_col_icons}>
                                    <TouchableOpacity
                                        style={[Style.product_col]}
                                        onPress={() =>
                                            this.handeBeenHere(
                                                this.state.store.store.id
                                            )}>
                                        <Icon
                                            style={[
                                                Style.product_col_Icon,
                                                this.state.selected_bn
                                                    ? Style.selectedIcon
                                                    : Style.deSelectedIcon, { borderRadius: 25, overflow: 'hidden' }]}
                                            name="map-marker" />
                                        <Text style={Style.product_col_desc}>
                                            {'Been here'}
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        activeOpacity={0.9}
                                        style={[
                                            Style.product_col,
                                            this.props.selected
                                                ? { backgroundColor: "rgba(80,94,104,0)" } : {}
                                        ]}
                                        onPress={() =>
                                            this._call(
                                                this.state.store.store.mobile
                                            )}>
                                        <Icon
                                            style={[
                                                Style.product_col_Icon,
                                                Style.deSelectedIcon, { borderRadius: 25, overflow: 'hidden' }
                                            ]}
                                            name="phone" />
                                        <Text style={Style.product_col_desc}>
                                            {'Call'}
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[
                                            Style.product_col,
                                            this.props.selected
                                                ? { backgroundColor: "rgba(80,94,104,0)" } : {}
                                        ]}
                                        onPress={() => this._locate(this.state.store.store.latitude,
                                            this.state.store.store.longitude)}>
                                        <Icon
                                            style={[
                                                Style.product_col_Icon,
                                                Style.deSelectedIcon, { borderRadius: 25, overflow: 'hidden' }
                                            ]}
                                            name="map" />
                                        <Text style={Style.product_col_desc}>
                                            {'Direction'}
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={Style.product_col}
                                        onPress={() => this._handleBlog(this.state.store.store.id)}>
                                        <Icon
                                            style={[
                                                Style.product_col_Icon,
                                                Style.deSelectedIcon, { borderRadius: 25, overflow: 'hidden' }
                                            ]}
                                            name="file-text"
                                        />
                                        <Text style={Style.product_col_desc}>
                                            {'Blog It'}
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={Style.product_col}
                                        onPress={() => {
                                            this._setAppointment(
                                                this.state.store.store.id
                                            );
                                        }}>
                                        <Icon
                                            style={[
                                                Style.product_col_Icon,
                                                Style.deSelectedIcon, { borderRadius: 25, overflow: 'hidden' }
                                            ]}
                                            name="calendar-times-o" />
                                        <Text style={Style.product_col_desc}>
                                            Appointment
                                    </Text>
                                    </TouchableOpacity>
                                </View>

                                {/* -------------------------------------------------------------------------------*/}

                                <View style={Style.product_description_wrapper}>
                                    {/*About Us*/}
                                    <View style={Style.product_description}>

                                        <TouchableOpacity onPress={() => console.log('this')} activeOpacity={0.9} style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                        </TouchableOpacity>


                                        <View style={{ flexWrap: 'wrap', flex: 1, flexDirection: 'row', justifyContent: 'space-between' }} >

                                            <View style={{ width: '75%' }}>
                                                <Text style={Style.product_description_title}>
                                                    {'About us'}
                                                </Text>
                                                <Text style={[Style.product_description_para]} >
                                                    {this.state.store.store.short_description}
                                                </Text>
                                            </View>
                                            {/*Image*/}
                                            <Image
                                                source={{
                                                    uri: this.state.store.store.logo_image ?
                                                        Config.BaseUrl + this.state.store.store.logo_image :
                                                        Config.NoImageUrl
                                                }}
                                                style={[Style.product_logo_img, { margin: 0, padding: 0, width: '24%', height: 70 }]}
                                            />

                                        </View>
                                    </View>
                                    {
                                        this.state.store.store.price_from ?
                                            (<View style={Style.product_description}>
                                                <Text style={Style.product_description_title}>
                                                    {'Price range'}
                                                </Text>
                                                <Text style={[Style.product_description_para]}>
                                                    {'From ₹ '}{this.state.store.store.price_from}{' to '}
                                                    {'₹ '}{this.state.store.store.price_to}
                                                </Text>
                                            </View>

                                            ) : null
                                    }


                                    {/*Why us */}
                                    {
                                        this.state.store.store.why_us !== "" ?
                                            <View style={[Style.product_description]}>
                                                <Text style={Style.product_description_title}>
                                                    Why {this.state.store.store.store_name}
                                                </Text>
                                                <HTMLView value={this.state.store.store.why_us} />
                                            </View> : null
                                    }
                                </View>

                                <View style={[Style.product_description_wrapper_wop, { marginTop: 10, marginBottom: 5 }]}>
                                    {/*Gallery Thumbnails*/}
                                    <View style={[Style.product_bottom_cat_section, { justifyContent: 'space-between', paddingLeft: '2.5%', paddingRight: '2.5%' }]}>
                                        <TouchableOpacity
                                            style={[Style.product_bottom_cat, { width: '48%', marginTop: 0, marginBottom: 5, height: explore_gallery_thumb_height }]}
                                            onPress={() =>
                                                navigate("StoreGallery", {
                                                    stid: this.state.store.store.id
                                                })}>
                                            <Image
                                                style={[Style.product_bottom_cat_img, { width: '100%', height: explore_gallery_thumb_height }]}
                                                source={{
                                                    uri: StoreGalleryImage
                                                }}
                                            />
                                            <View style={[Style.product_bottom_cat_view, { marginLeft: 0, left: 0, width: '100%', height: explore_gallery_thumb_height }]}>
                                                <Text style={Style.product_bottom_cat_txt}>
                                                    Explore Store Gallery
                                            </Text>
                                            </View>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={[Style.product_bottom_cat, { width: '48%', marginTop: 0, marginBottom: 5, marginLeft: '2%', position: 'relative', height: explore_gallery_thumb_height }]}
                                            onPress={() =>
                                                navigate("UserGallery", {
                                                    stid: this.state.store.store.id
                                                })}>
                                            <Image
                                                style={[Style.product_bottom_cat_img, { width: '100%', height: explore_gallery_thumb_height }]}
                                                source={{
                                                    uri: UserGalleryImage
                                                }}
                                            />
                                            <View style={[Style.product_bottom_cat_view, { marginLeft: 0, left: 0, width: '100%', height: explore_gallery_thumb_height }]}>
                                                <Text style={Style.product_bottom_cat_txt}>
                                                    Explore User Gallery
                                            </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>

                                    {/*Collections....*/}
                                    <StoreCollections
                                        handleCPNavigation={this.handleCPNavigation}
                                        collectiondata={this.state.store.store_collection}
                                    />
                                    {/*Collections....*/}


                                    {/*Offer and events*/}
                                    <View style={[Style.product_description, {
                                        padding: 0, paddingTop: 0
                                    }]}>
                                        <TouchableOpacity onPress={() => navigate('StoreOffersEvents', { storeid: this.state.store.store.id })} style={[Style.product_bottom_cat_1, { width: '100%' }]}>
                                            <Image
                                                style={[Style.product_bottom_cat_img_1, { height: height_of_offers }]}
                                                source={{
                                                    uri: OffersImage
                                                }}
                                            />

                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {this.state.store_blogs.length > 0 ?
                                    <View style={[Style.product_description_wrapper_wop, { marginTop: 10, marginBottom: 10 }]}>
                                        {/*----------------------Blogs and Reviews-----------------------------------*/}
                                        <View style={Style.product_description}>
                                            <Text
                                                style={
                                                    Style.product_description_title_center
                                                }>Blogs & Reviews</Text>
                                            {this.state.store_blogs.map(blog => {
                                                return (
                                                    <View style={Style.blogCard} key={blog.title}>
                                                        <Text style={Style.blogCardTitle} onPress={() =>
                                                            navigate("Blog", {
                                                                id: blog.id
                                                            })}>
                                                            {blog.title}
                                                        </Text>
                                                    </View>
                                                );
                                            })}


                                            {
                                                this.state.blogsDone ? null :
                                                    (<View>
                                                        <TouchableOpacity onPress={this.handleMoreBLogs}>
                                                            <Text style={{ textAlign: 'center', fontWeight: '500', fontSize: 14 }}>{'Load More'}</Text>
                                                        </TouchableOpacity>
                                                    </View>)
                                            }


                                        </View>
                                    </View> : null}

                                {/*Visit my designer*/}
                                {
                                    this.state.store.store_designer.length > 0 ?
                                        <View>
                                            <TouchableOpacity style={{
                                                width: '96%',
                                                backgroundColor: '#E29A0D',
                                                borderRadius: 3,
                                                padding: 8,
                                                paddingLeft: 10,
                                                marginLeft: '2%',
                                                marginBottom: 10
                                            }} onPress={() => navigate("DesignerProfile", { id: this.state.store.store_designer[0].id })}>
                                                <Text style={[{
                                                    color: '#fff',
                                                    marginBottom: 0,
                                                    textAlign: 'center'
                                                }]}>Visit Designer Profile</Text>
                                            </TouchableOpacity>
                                        </View> : null
                                }





                                <View style={[Style.product_description_wrapper, { marginTop: 10 , marginBottom: 5 }]}>
                                    {/*Buttons*/}
                                    <View style={{ flex: 1, flexWrap: 'wrap', flexDirection: 'row', marginBottom: 5 }}>


                                        <TouchableOpacity
                                            style={{
                                                width: '47%',
                                                backgroundColor: '#E29A0D',
                                                borderRadius: 3,
                                                padding: 8,
                                                paddingLeft: 10,
                                                marginTop: '1%',
                                                marginLeft: '1%'
                                            }}
                                            onPress={this.handleNearMe}>
                                            <Text style={Style.btnLogInText}>
                                                {" "}
                                                <Icon
                                                    name="street-view"
                                                    size={20}
                                                    color="#900"
                                                />{" "}{'Near By'}{" "}
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={{
                                                width: '47%',
                                                backgroundColor: '#E29A0D',
                                                borderRadius: 3,
                                                padding: 8,
                                                paddingLeft: 10,
                                                marginTop: '1%',
                                                marginLeft: '4%'
                                            }}
                                            onPress={this.shareStore}>
                                            <Text style={Style.btnLogInText}>
                                                {" "}
                                                <Icon
                                                    name="share"
                                                    size={20}
                                                    color="#900"
                                                />{" "}
                                                Share{" "}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    {/* Store FAQs */}
                                    {this.state.faqs.length > 0 ? (
                                        <View style={Style.product_description}>
                                            <Text
                                                style={
                                                    Style.product_description_title_center_bottom
                                                }>
                                                {"FAQs"}
                                            </Text>
                                            <Accordion
                                                sections={this.state.faqs}
                                                renderHeader={this._renderHeaderAcc}
                                                renderContent={this._renderContentAcc}
                                                duration={500}
                                                underlayColor={'transparent'}
                                                easing={'ease'}
                                            />

                                            <TouchableOpacity
                                                style={{
                                                    width: '100%',
                                                    backgroundColor: '#E29A0D',
                                                    borderRadius: 3,
                                                    padding: 8,
                                                    paddingLeft: 10
                                                }}
                                                onPress={() => navigate("AskQuestion",
                                                    { token: this.state.token, store_id: this.state.store.store.id })}>
                                                <Text
                                                    style={[
                                                        Style.product_description_title_center_bottom, {
                                                            color: '#fff',
                                                            marginBottom: 0
                                                        }
                                                    ]}>
                                                    {" "}
                                                    <Icon
                                                        name="question"
                                                        size={20}
                                                        color="#900"
                                                    />{" "} Ask a question
                                          </Text>
                                            </TouchableOpacity>
                                        </View>
                                    ) : (
                                            <TouchableOpacity
                                                style={{
                                                    width: '100%',
                                                    backgroundColor: '#E29A0D',
                                                    borderRadius: 3,
                                                    padding: 8,
                                                    paddingLeft: 10
                                                }}
                                                onPress={() => navigate("AskQuestion",
                                                    { token: this.state.token, store_id: this.state.store.store.id })}>
                                                <Text
                                                    style={[
                                                        Style.product_description_title_center_bottom, {
                                                            color: '#fff',
                                                            marginBottom: 0
                                                        }
                                                    ]}>
                                                    {" "}
                                                    <Icon
                                                        name="question"
                                                        size={20}
                                                        color="#900"
                                                    />{" "} Ask a question
                                    </Text>
                                            </TouchableOpacity>
                                        )}
                                    {/* Store FAQs End*/}

                                    <View style={{ flex: 1, flexWrap: 'wrap', flexDirection: 'row' }}>
                                        {/*Report Error*/}
                                        <TouchableOpacity
                                            style={{
                                                width: '47%',
                                                backgroundColor: '#808080',
                                                borderRadius: 3,
                                                padding: 8,
                                                paddingLeft: 10,
                                                marginTop: '3%',
                                                marginLeft: '1%'
                                            }}
                                            onPress={() =>
                                                navigate("ReportError", {
                                                    store_id: this.state.store.store.id,
                                                    error_type: "partner"
                                                })}>
                                            <Text
                                                style={[Style.product_description_title_center_bottom, {
                                                    color: '#fff',
                                                    marginBottom: 0
                                                }]}>
                                                <Icon
                                                    name="exclamation-triangle"
                                                    size={20}
                                                    color="#900"
                                                />{" "}
                                                Report Error
                                        </Text>
                                        </TouchableOpacity>
                                        {/*Submit Feedback*/}
                                        <TouchableOpacity
                                            style={{
                                                width: '47%',
                                                backgroundColor: '#808080',
                                                borderRadius: 3,
                                                padding: 8,
                                                paddingLeft: 10,
                                                marginTop: '3%',
                                                marginLeft: '4%'
                                            }}
                                            onPress={() => this.handleFeedback()}>
                                            <Text
                                                style={[Style.product_description_title_center_bottom, {
                                                    color: '#fff',
                                                    marginBottom: 0
                                                }]}>
                                                {" "}
                                                <Icon
                                                    name="comment"
                                                    size={20}
                                                    color="#900"
                                                />{" "}
                                                {'Feedback'}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                            </View>
                        </ScrollView>
                        {/*Footer*/}
                        {/*
                            !this.state.hideHome ?
                                <View style={[Style.fixedFooter, { width: 50, height: 50, borderRadius: 100, borderColor: '#E29A0D', right: '4%', bottom: '3%', flex: 1, flexDirection: 'row', justifyContent: 'flex-end', backgroundColor: '#fff', borderWidth: 0.4, }]}>
                                    <TouchableOpacity style={[Style.iconFixFooter]} onPress={() => this.props.navigation.navigate('Main')}>
                                        <TabBarIcon icon={Images.icons.news} tintColor={'#E29A0D'} />
                                    </TouchableOpacity>
                                </View> : null
                        */}
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

export default ProductScreen;
