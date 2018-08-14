import React, { Component } from "react";
import {
	View,
	Text,
	Button,
	TouchableOpacity,
	Image,
	ScrollView,
	Platform,
	ToastAndroid,
	Alert,
	AsyncStorage,
	Dimensions
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { SpinkitLarge,TabBarIcon } from "@components";
import { Languages, Style, Config,gAnalytics,Images } from "@common";
import css from "./style";
import { inject, observer } from "mobx-react";
import moment from "moment";
// Import branch and BranchEvent
import branch, { BranchEvent } from 'react-native-branch'
import Share, { ShareSheet } from 'react-native-share';

const { width, height, scale } = Dimensions.get("window");
const newheight = height + 10;

@inject("stores")
@observer
export default class BloggerProfileScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			animating: true,
			bloggerData: [],
			selected_bm_blogger: false,
			blogsdata: [],
			total_blogs: null,
			blogsDone: false,
			addmoreblogCount: 1,
			dataupdated: false,
			loadmorerequired : true,
			shareUrl: '',
			hideHome: false,
			paramId : null,
		};
    
    	gAnalytics.trackScreenView('BloggerProfilePage');
}

	static navigationOptions = {
		title: "Blogger Profile",
		headerMode: "screen"
	};

	componentWillMount() {
		var paramId = this.props.navigation.state.params.id;
		
		this.setState({
			paramId
		},()=>{
			AsyncStorage.getItem("usertoken")
				.then(token => {
					if (token) {
						this.setState({ token }, () => {
					/* Google analytics */
					this.props.stores.user.getuserInfoBasic()
								.then(data => {
									let d = JSON.parse(data)
									gAnalytics.setUser(d.id.toString());
								}).catch(err => console.log(err))
						
					gAnalytics.trackEvent('blogger', 'view', { name: 'BloggerProfilePage' });
					/* Google analytics */

					/*If yes/not call blogger....*/
					this.props.stores.blog
						.getBlogger(paramId, this.state.token)
						.then(result => {
							if (result.status == "success") {
								if (this.state.addmoreblogCount == 1 && result.blogs.length < 2) {
									this.setState({ loadmorerequired: false })
								}
								this.setState({
									bloggerData: result,
									animating: false,
									blogsdata: result.blogs
								}, () => {
									/*Create Branch link*/
									this.createBranchUniversalObject()
									/*Create Branch link End*/

									if (result.bookmark_status == 1 || result.bookmark_status == "1") {
										this.setState({ selected_bm_blogger: true });
									}
									gAnalytics.trackEvent('blogger', 'profile', {
										id: this.state.bloggerData.blogger.id,
										name: this.state.bloggerData.blogger.first_name + " " + this.state.bloggerData.blogger.last_name,
									});
								});
							}
						})
						.catch(err => {
							console.log(err);
						});
						});
					}
				})
				.catch(err => {
					console.log(err);
				});
		})		
		
		/*Calling blogger end............*/
	}

	createBranchUniversalObject = () => {
		
			let bloggername = this.state.bloggerData.blogger
				.first_name + " " + this.state.bloggerData.blogger.last_name
			let defaultBUO = {
				locallyIndex: true,
				title: 'Zingbi Blogger',
				contentDescription: 'Zingbi Blogger : ' + bloggername,
				contentMetadata: {
					customMetadata: {
						'navigation_type': 'BloggerProfile',
						'name': bloggername,
						'id': this.state.bloggerData.blogger.id + ""
					}
				}
			}

			branch.createBranchUniversalObject('zingbiblogger', defaultBUO)
					.then(result => {
						if(this.buo) this.buo.release()
						this.buo = result
						this.generateShortUrl()
					}).catch(e => console.log(e));
				// result.logEvent(BranchEvent.ViewItem)
			// console.log("Created Branch Universal Object and logged standard view item event.")
	}

	generateShortUrl = () => {
		if (!this.buo) this.createBranchUniversalObject()
			let linkProperties = {
				feature: 'share',
				channel: 'All',
			}
			let controlParams = {
				$desktop_url: 'https://www.zingbi.com/blogger/' + this.state.bloggerData.blogger.id,
				$fallback_url: 'https://www.zingbi.com/blogger/' + this.state.bloggerData.blogger.id,
			}
			this.buo.generateShortUrl(linkProperties, controlParams)
				.then(result => {
					this.setState({ shareUrl: result.url })
				}).catch(e => console.log(e))
	}

	_handleShare(bid) {
		let event = new BranchEvent(BranchEvent.Share, { type: 'Blogger', id: bid })
		event.logEvent()

		let shareOptions = {
			title: "Zingbi",
			url: this.state.shareUrl ? this.state.shareUrl : 'https://www.zingbi.com/blogger/' + bid,
			type: 'image/png',
			subject: "Zingbi blogger" //  for email
		};
		Share.open(shareOptions);
	}

	handleMoreBLogs = () => {
		this.setState(
			{addmoreblogCount: this.state.addmoreblogCount + 1},
			() => {
				this.props.stores.blog
					.LoadMoreBlogs(
						this.state.bloggerData.blogger.id,
						this.state.addmoreblogCount
					)
					.then(res => {
						if (res.status == "success") {
							this.setState({
								blogsdata: [...this.state.blogsdata,...res.blogs],
								dataupdated: true
							});
						} else {
							this.setState({
								blogsDone: true,
								dataupdated: false,
								loadmorerequired : false
							});
						}
					})
					.catch(err => console.log(err));
			}
		);
	};

	_handleBookmark(bloggerid) {
		if (this.state.token) {
			//bookmarkDesigner
			this.state.selected_bm_blogger
				? this.bookmark(bloggerid, this.state.token, "remove")
				: this.bookmark(bloggerid, this.state.token, "add");
		} else {
			if (Platform.OS === "android") {
				ToastAndroid.show("You are not logged in", ToastAndroid.SHORT);
			} else {
				Alert.alert("You are not logged in");
			}
		}
	}

	bookmark(id, token, action) {
		this.props.stores.blog
			.bookmarkBlogger(id, token, action)
			.then(res => {
				if (action == "add") {
					if (res.status == "success") {
						this.setState({ selected_bm_blogger: true },() => {
				 			gAnalytics.trackEvent('blogger','favorite',{type : 'add',bloggerId:id});
						});
					} else {
						this.setState({ selected_bm_blogger: false });
					}
				} else if (action == "remove") {
					if (res.status == "success") {
						this.setState({ selected_bm_blogger: false },() => {
				 			gAnalytics.trackEvent('blogger','favorite',{type : 'remove',bloggerId:id});
						});
					} else {
						this.setState({ selected_bm_blogger: true });
					}
				} else {
					this.setState({ selected_bm_blogger: false });
				}
			})
			.catch(error => console.log(error));
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
			const { bloggerData } = this.state;
			return (
			<View style={Style.container}>	
				<View style={{flexDirection: 'row',flex:1, marginBottom:50}}>
				<ScrollView
					style={[{ backgroundColor: "#fff",height:'100%'}]}
					ref={ref => (this.scrollView = ref)}
					onContentSizeChange={(contentWidth, contentHeight) => {
						if (this.state.dataupdated) {
							this.scrollView.scrollToEnd({ animated: true });
						}
					}}
						onMomentumScrollBegin={() => { this.setState({ hideHome: true }) }}
						onMomentumScrollEnd={() => { this.setState({ hideHome: false }) }}>
					<View style={{}}>
						<Image
							style={[
								Style.browseCategory_img_avatar_large,
								{ marginTop: 20 }
							]}
							source={{
								uri: bloggerData.blogger.profile_pic
									? Config.BaseUrl +
										bloggerData.blogger.profile_pic
									: Config.NoImageUrl
							}}/>

							<View style={{ flexDirection: 'row', alignContent: 'center', justifyContent: 'center' }} >
							<TouchableOpacity
								style={[
									Style.product_star_favourite,
									this.state.selected_bm_blogger
										? Style.selectedAttribute
										: Style.deSelectedAttribute,
									{ position: "relative", left: 0 }
								]}
								activeOpacity={0.9}
								onPress={() =>
									this._handleBookmark(
										bloggerData.blogger.id
									)}>
								<Icon
									name="star"
									style={[
										Style.product_icon_white,
										Style.borderZero,
										this.state.selected_bm_blogger
											? Style.selectedIcon
											: Style.deSelectedIcon,
										{
											marginBottom: 30,
											position: "relative"
										}]}/>
							</TouchableOpacity>
								<TouchableOpacity
									style={[
										Style.product_star_favourite,
										Style.selectedAttribute,
										{
											position: "relative",
											alignSelf: "center",
											left: 10,
											paddingBottom: 20
										}
									]}
									activeOpacity={0.9}
									onPress={() =>
										this._handleShare(bloggerData.blogger.id)}>
									<Icon
										name="share"
										style={[
											Style.product_icon_white,
											Style.borderZero,
											Style.selectedIcon,
											{ marginBottom: 20, position: "relative" }
										]} />
								</TouchableOpacity>
						</View>
					</View>

					<View
						style={[
							Style.designer_profile_container,
							{
								borderTopWidth: 1,
								borderTopColor: "#eee",
								marginTop: 35,
								width: "94%",
								marginLeft: "3%"
							}
						]}>
						<Text style={Style.designer_profile_title}>Name</Text>
						<Text style={Style.designer_profile_body}>
							{bloggerData.blogger.first_name}{" "}
							{bloggerData.blogger.last_name}
						</Text>

						{bloggerData.blogger.location ? (
							<View>
								<Text style={Style.designer_profile_title}>
									{'I am from'}
								</Text>
								<Text style={Style.designer_profile_body}>
									{bloggerData.blogger.location}
								</Text>
							</View>
						) : null}

						{bloggerData.blogger.date_of_birth ? (
							<View>
								<Text style={Style.designer_profile_title}>
									{'I was Born on'}
								</Text>
								<Text style={Style.designer_profile_body}>
									{moment(
										bloggerData.blogger.date_of_birth
									).format("DD-MM-YYYY")}
								</Text>
							</View>
						) : null}

						{bloggerData.blogger.full_time_status ? (
							<View>
								<Text style={Style.designer_profile_title}>
									{'Full time blogger'}
								</Text>
								<Text style={Style.designer_profile_body}>
									{bloggerData.blogger.full_time_status == "1"
										? "Yes"
										: "No"}
								</Text>
							</View>
						) : null}

						{bloggerData.blogger.short_description ? (
							<View>
								<Text style={Style.designer_profile_title}>
									{bloggerData.blogger.short_description
										? "Let me introduce myself"
										: null}
								</Text>
								<Text style={Style.designer_profile_body}>
									{bloggerData.blogger.short_description}
								</Text>
							</View>
						) : null}

						{bloggerData.blogger.favourite_blog_reason ? (
							<View>
								<Text style={Style.designer_profile_title}>
									{'My favourite Blog & reason for favouritism'}
								</Text>
								<Text style={Style.designer_profile_body}>
									{bloggerData.blogger.favourite_blog_reason}
								</Text>
							</View>
						) : null}

						{bloggerData.blogger.about_fashion ? (
							<View>
								<Text style={Style.designer_profile_title}>
									{'What I love about fashion'}
								</Text>
								<Text style={Style.designer_profile_body}>
									{bloggerData.blogger.about_fashion}
								</Text>
							</View>
						) : null}

						{bloggerData.blogger.something_personal ? (
							<View>
								<Text style={Style.designer_profile_title}>
									{'Something Personal'}
								</Text>
								<Text style={Style.designer_profile_body}>
									{bloggerData.blogger.something_personal}
								</Text>
							</View>
						) : null}

						{bloggerData.blogger.blogging_styles ? (
							<View>
								<Text style={Style.designer_profile_title}>
									{'My blogging styles'}
								</Text>
								<Text style={Style.designer_profile_body}>
									{bloggerData.blogger.blogging_styles}
								</Text>
							</View>
						) : null}

						{bloggerData.blogger.achievements ? (
							<View>
								<Text style={Style.designer_profile_title}>
									{'My proudest achievement'}
								</Text>
								<Text style={Style.designer_profile_body}>
									{bloggerData.blogger.achievements}
								</Text>
							</View>
						) : null}
					</View>

					{this.state.blogsdata.length > 0 ? (
						<View
							style={[
								Style.product_description_wrapper_wop,
								{ marginBottom: 25 }
							]}>
							{/*----------------------Blogs and Reviews-----------------------------------*/}
							<View style={Style.product_description}>
								<Text
									style={
										Style.product_description_title_center
									}>
									Blogs
								</Text>
								{this.state.blogsdata.map(blog => {
									return (
										<View
											style={[
												Style.blogCard,
												{ borderBottomColor: "#fff" }
											]}
											key={blog.title}>
											<Text
												style={[Style.blogCardTitle]}
												onPress={() =>
													this.props.navigation.navigate(
														"Blog",
														{
															id: blog.id
														}
													)}>
												{blog.title}
											</Text>
										</View>
									);
								})}
								{ this.state.loadmorerequired ?
								<View>
									<TouchableOpacity
										onPress={
											this.state.blogsDone
												? console.log("nonce")
												: this.handleMoreBLogs
										}>
										<Text
											style={{
												textAlign: "center",
												fontWeight: "500",
												fontSize: 15,
												marginBottom : 15,
											}}>
											{this.state.blogsDone
												? "That's it !"
												: "Load More"}
										</Text>
									</TouchableOpacity>
								</View>
								: null }
							</View>
						</View>
					) : null}
				</ScrollView>

				</View>
				
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
				
				
					{/*
						!this.state.hideHome ?
							<View style={[Style.fixedFooter, { width: 50, height: 50, 
								borderRadius: 100, right: '4%', bottom: '4%',
								flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }]}>
								<TouchableOpacity style={Style.iconFixFooter} onPress={() => this.props.navigation.navigate('Main')}>
									<TabBarIcon icon={Images.icons.news} tintColor={'#fff'} />
								</TouchableOpacity>
							</View> : null
					*/}
			</View>	
			);
		} else {
			return <SpinkitLarge />;
		}
	}
}