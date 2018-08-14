import React, { Component } from "react";
import {
	View,
	Text,
	Button,
	TouchableOpacity,
	Image,
	ScrollView,
	AsyncStorage,
	Platform,
	ToastAndroid,
	Alert
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { SpinkitLarge,TabBarIcon} from "@components";
import { Languages, Style, Config, gAnalytics,Images } from "@common";
import css from "./style";
import { inject, observer } from "mobx-react";
import styles from "../../../styles";
import moment from "moment";
// Import branch and BranchEvent
import branch, { BranchEvent } from 'react-native-branch'
import Share, { ShareSheet } from 'react-native-share';

// Import branch and BranchEvent
// import branch, { BranchEvent } from 'react-native-branch'
/*Import modules for designer*/

@inject("stores")
@observer
export default class DesignerProfileScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			animating: true,
			designerData: [],
			token: null,
			selected_bm_designer: false,
			shareUrl : '',
			hideHome : false
		};

		gAnalytics.trackScreenView("DesignerProfilePage");
		// gtracker.trackEvent("Screen", "Designer Profile");
	}

	static navigationOptions = {
		title: "Designer Profile",
		headerMode: "screen"
	};

	componentWillMount() {
		var paramId = this.props.navigation.state.params.id;
		AsyncStorage.getItem("usertoken")
			.then(token => {
				if (token) {
					this.setState({ token }, () => {
						this.props.stores.user
							.getuserInfoBasic()
							.then(data => {
								let d = JSON.parse(data);
								gAnalytics.setUser(d.id.toString());
							})
							.catch(err => console.log(err));
					});
				}
				gAnalytics.trackEvent("designer", "view", {
					name: "DesignerProfilePage"
				});
				/*If yes/not call designer....*/
				this.props.stores.designer
					.getDesigner(paramId, this.state.token)
					.then(result => {
						if (result.status == "success") {
							this.setState({
									designerData: result,
									animating: false
								},
								() => {
									/*Create Branch link*/
									this.createBranchUniversalObject()
			                        /*Create Branch link End*/
									if (
										result.bookmark_status == 1 ||
										result.bookmark_status == "1"
									) {
										this.setState({
											selected_bm_designer: true
										});
									}

									gAnalytics.trackEvent("Profile","Designer",{
											id: this.state.designerData.designer
												.id,
											name:
												this.state.designerData.designer
													.first_name +
												" " +
												this.state.designerData.designer
													.last_name
										});
								}
							);
						} else {
							this.setState({ animating: false });
						}
					})
					.catch(err => {
						console.log(err);
					});
				/*Calling designer end............*/
			})
			.catch(err => console.log(err));
	}



	createBranchUniversalObject = () => {
			let designername = this.state.designerData.designer
				.first_name + " " + this.state.designerData.designer.last_name
			let defaultBUO = {
				locallyIndex: true,
				title: 'Zingbi Designer',
				contentDescription: 'Zingbi Designer : ' + designername,
				contentMetadata: {
					customMetadata: {
						'navigation_type': 'DesignerProfile',
						'name': designername,
						'id': this.state.designerData.designer.id + ""
					}
				}
			}

			branch.createBranchUniversalObject('zingbidesigner', defaultBUO)
							.then(result => {
								if (this.buo) this.buo.release()
								this.buo = result
								this.generateShortUrl()
							}).catch(e => console.log(e));
			// console.log('createBranchUniversalObject>>>', result)
	}

	generateShortUrl = () => {
		if (!this.buo) this.createBranchUniversalObject()
		
			let linkProperties = {
				feature: 'share',
				channel: 'All',
			}
			let controlParams = {
				$desktop_url: 'https://www.zingbi.com/designer/' + this.state.designerData.designer.id,
				$fallback_url: 'https://www.zingbi.com/designer/' + this.state.designerData.designer.id,
			}
			this.buo.generateShortUrl(linkProperties, controlParams)
						.then(result => {
								this.setState({ shareUrl: result.url })
						}).catch(e => console.log(e))
	}

	_handleShare(did) {
		let event = new BranchEvent(BranchEvent.Share, { type: 'Designer', id: did })
		event.logEvent()

		let shareOptions = {
			title: "Zingbi",
			url: this.state.shareUrl ? this.state.shareUrl : 'https://www.zingbi.com/designer/' + did,
			type: 'image/png',
			subject: "Zingbi designer" //  for email
		};
		Share.open(shareOptions);
	}
	_handleBookmark(did) {
		if (this.state.token) {
			//bookmarkDesigner
			this.state.selected_bm_designer
				? this.handleBmLocal(did, this.state.token, "remove")
				: this.handleBmLocal(did, this.state.token, "add");
		} else {
			if (Platform.OS === "android") {
				ToastAndroid.show("You are not logged in", ToastAndroid.SHORT);
			} else {
				Alert.alert("You are not logged in");
			}
		}
	}

	handleBmLocal(id, token, action) {
		this.props.stores.designer
			.bookmarkDesigner(id, token, action)
			.then(res => {
				if (action == "add") {
					if (res.status == "success") {
						this.setState({ selected_bm_designer: true }, () => {
							gAnalytics.trackEvent("designer", "favorite", {
								type: "add",
								designerId: id
							});
						});
					} else {
						this.setState({ selected_bm_designer: false });
					}
				} else if (action == "remove") {
					if (res.status == "success") {
						this.setState({ selected_bm_designer: false }, () => {
							gAnalytics.trackEvent("designer", "favorite", {
								type: "remove",
								designerId: id
							});
						});
					} else {
						this.setState({ selected_bm_designer: true });
					}
				} else {
					this.setState({ selected_bm_designer: false });
				}
			})
			.catch(error => console.log(error));
	}
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
			const { designerData } = this.state;
			return (
			<View style={Style.container}>	
					<View style={{flexDirection: 'row',flex:1, marginBottom:50}}>
					<ScrollView 
						onMomentumScrollBegin={() => { this.setState({ hideHome: true }) }}
						onMomentumScrollEnd={() => { this.setState({ hideHome: false }) }}>{/*style={{ height: '100%' }}*/}
					<Image
						style={[
							Style.browseCategory_img_avatar_large,
							{ marginTop: 20 }
						]}
						source={{
							uri: designerData.designer.profile_pic
								? Config.BaseUrl +
									designerData.designer.profile_pic
								: Config.NoImageUrl
						}}/>

					<View style={{flexDirection:'row',alignContent:'center',justifyContent:'center'}} >
							<TouchableOpacity
								style={[
									Style.product_star_favourite,
									this.state.selected_bm_designer
										? Style.selectedAttribute
										: Style.deSelectedAttribute,
									{
										position: "relative",
										alignSelf: "center",
										left: 0,
										paddingBottom: 20,
									}
								]}
								activeOpacity={0.9}
								onPress={() =>
									this._handleBookmark(designerData.designer.id)}>
								<Icon
									name="star"
									style={[
										Style.product_icon_white,
										Style.borderZero,
										this.state.selected_bm_designer
											? Style.selectedIcon
											: Style.deSelectedIcon,
										{ marginBottom: 20, position: "relative" }
									]} />
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
									this._handleShare(designerData.designer.id)}>
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
						<View>
							<Text style={Style.designer_profile_title}>
								{"Name"}
							</Text>
							<Text style={Style.designer_profile_body}>
								{designerData.designer.first_name} {" "}
								{designerData.designer.last_name}{" "}
							</Text>
						</View>

						{designerData.designer.dob ? (
							<View>
								<Text style={Style.designer_profile_title}>
									{"I was born on"}
								</Text>
								<Text style={Style.designer_profile_body}>
									{moment(designerData.designer.dob).format(
										"DD-MM-YYYY"
									)}
								</Text>
							</View>
						) : null}

						{designerData.designer.birth_location ? (
							<View>
								<Text style={Style.designer_profile_title}>
									{"I am from"}
								</Text>
								<Text style={Style.designer_profile_body}>
									{designerData.designer.birth_location}
								</Text>
							</View>
						) : null}

						{designerData.designer.label_name ? (
							<View>
								<Text style={Style.designer_profile_title}>
									{"My label's name is"}
								</Text>
								<Text style={Style.designer_profile_body}>
									{designerData.designer.label_name}
								</Text>
							</View>
						) : null}

						{designerData.designer.designer_store_location ? (
							<View>
								<Text style={Style.designer_profile_title}>
									{"You can find my store at"}
								</Text>
								<Text style={Style.designer_profile_body}>
									{
										designerData.designer
											.designer_store_location
									}
								</Text>
							</View>
						) : null}

						{designerData.designer.website ? (
							<View>
								<Text style={Style.designer_profile_title}>
									{"Check out my website"}
								</Text>
								<Text style={Style.designer_profile_body}>
									{designerData.designer.website}
								</Text>
							</View>
						) : null}

						{designerData.designer.short_description ? (
							<View>
								<Text style={Style.designer_profile_title}>
									{"Let me introduce myself"}
								</Text>
								<Text style={Style.designer_profile_body}>
									{designerData.designer.short_description}
								</Text>
							</View>
						) : null}

						{designerData.designer.back_in_time ? (
							<View>
								<Text style={Style.designer_profile_title}>
									{"Looking back in time"}
								</Text>
								<Text style={Style.designer_profile_body}>
									{designerData.designer.back_in_time}
								</Text>
							</View>
						) : null}

						{designerData.designer.favourite_styles ? (
							<View>
								<Text style={Style.designer_profile_title}>
									{"My favourite Style"}
								</Text>
								<Text style={Style.designer_profile_body}>
									{designerData.designer.favourite_styles}
								</Text>
							</View>
						) : null}

						{designerData.designer.love_about_fashion ? (
							<View>
								<Text style={Style.designer_profile_title}>
									{"What I love about fashion"}
								</Text>
								<Text style={Style.designer_profile_body}>
									{designerData.designer.love_about_fashion}
								</Text>
							</View>
						) : null}

						{this.state.designerData.designer_collection.length >
						0 ? (
							<View style={[Style.product_bottom_cat_section]}>
								<Text
									style={{
										marginTop: 5,
										textAlign: "center",
										fontWeight: "600",
										marginBottom: 5,
										width: "100%"
									}}>
									{"My Collections"}
								</Text>
							</View>
						) : null}

						{this.state.designerData.designer_collection.length >
						0 ? (
							<ScrollView
								style={[styles.rowFlex, { marginBottom: 6 }]}
								horizontal={true}
								showsHorizontalScrollIndicator={false}
								alwaysBounceHorizontal={true}>
								<View
									style={[
										Style.product_bottom_cat_section,
										{ marginBottom: 6 }
									]}>
									{this.state.designerData.designer_collection.map(
										collection => {
											return (
												<TouchableOpacity
													key={collection.id}
													style={[
														styles.browseCategory_col,
														{
															width: 150,
															marginRight: 10
														}
													]}
													onPress={() =>
														this.props.navigation.navigate(
															"DesignerCollectionGallery",
															{coll_id:collection.id}
														)}>
													<Image
														style={[Style.product_bottom_cat_img,{
																width: "100%",
																height: 180
															}]}
														source={{
															uri:
																Config.BaseUrl +
																collection.image
														}}/>
													<View
														style={[Style.product_bottom_cat_view,{
																marginLeft: 0,
																left: 0,
																width: "100%",
																height: "100%",
																borderRadius: 5
															}]}>
														<Text style={Style.product_bottom_cat_txt}>
															{collection.collection_name}
														</Text>
													</View>
												</TouchableOpacity>
											);
										}
									)}
								</View>
							</ScrollView>
						) : null}

						{designerData.designer.me_and_fashion_industry ? (
							<View>
								<Text style={Style.designer_profile_title}>
									{"Me and the fashion industry"}
								</Text>
								<Text style={Style.designer_profile_body}>
									{
										designerData.designer
											.me_and_fashion_industry
									}
								</Text>
							</View>
						) : null}

						{designerData.designer.something_personal ? (
							<View>
								<Text style={Style.designer_profile_title}>
									{"Something personal"}
								</Text>
								<Text style={Style.designer_profile_body}>
									{designerData.designer.something_personal}
								</Text>
							</View>
						) : null}

						{designerData.designer.label_logo ? (
							<View>
								<Text style={Style.designer_profile_title}>
									{"Label Logo"}
								</Text>
								<Image
									style={{ height: 50, width: 50 }}
									source={{
										uri: designerData.designer.label_logo
											? Config.BaseUrl +
												designerData.designer.label_logo
											: Config.NoImageUrl
									}}/>
							</View>
						) : null}

						{designerData.designer.story_behind_logo_name ? (
							<View>
								<Text style={Style.designer_profile_title}>
									{"Story behind my logo name"}
								</Text>
								<Text style={Style.designer_profile_body}>
									{
										designerData.designer
											.story_behind_logo_name
									}
								</Text>
							</View>
						) : null}

						{designerData.designer_stores.length > 0 ? (
							<View>
								<View style={{ marginBottom: 15 }}>
									<Text style={Style.designer_profile_title}>
										{"Designer Stores"}
									</Text>
								</View>
								{designerData.designer_stores.map(store => {
									return (
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
												this.props.navigation.navigate(
													"Product",
													{
														id: store.store_id
													}
												)}>
											<Text style={[{color: "#fff",
														marginBottom: 0,
														textAlign: "center"}]}>
												{store.store_name}
											</Text>
										</TouchableOpacity>
									);
								})}
							</View>
						) : null}
					</View>
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
							<View style={[Style.fixedFooter, { width: 50, height: 50, borderRadius: 100, right: '4%', bottom: '3%', flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }]}>
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