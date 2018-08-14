import React, { Component } from "react";
import {
	View,
	Text,
	Button,
	TouchableOpacity,
	Image,
	ScrollView,
	AsyncStorage,
	TextInput,
	Alert,
	FlatList,
	SectionList,
	Platform,
	ToastAndroid
} from "react-native";
import { NavigationActions } from "react-navigation";
import Icon from "react-native-vector-icons/FontAwesome";
import { SpinkitLarge, TabBarIcon } from "@components";
import { Languages, Style, Images, Config , gAnalytics } from "@common";
import { inject, observer, observable } from "mobx-react";
import { ListItem,Avatar } from "react-native-elements";
import css from "../SignIn/style";

@inject("stores")
@observer
export default class FavoritesScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			page: "third",
			loading: this.props.stores.user.bmload,
			LoginStatus: this.props.stores.user.LoginStatus,
			token: "",
			bookmarks: this.props.stores.user.bookmarksdata,
			isFetching: false
		};
	
		gAnalytics.trackScreenView('FavoritesPage');
	}

	componentWillMount() {
		const { navigate } = this.props.navigation;

		//this.setState({bookmarks : this.props.stores.user.bookmarksdata})

		// this.setState({loading : true})
		AsyncStorage.getItem("usertoken")
			.then(item => {
				if (item) {
					this.setState({ LoginStatus: true, loading: true } , () => {
						this.props.stores.user.getuserInfoBasic()
			            .then(data => {
			                let d = JSON.parse(data)
			                gAnalytics.setUser(d.id.toString());
			            }).catch(err => console.log(err))
					});
					this.props.stores.user
						.getMyBookmarks(item)
						.then(res => {
							let arr = [];
							if (res.status == "success") {
								this.setState({
									bookmarks: res.bookmarks,
									loading: false,
									token: item
								});
							} else {
								this.setState({
									bookmarks: [],
									loading: false
								});
							}
						})
						.catch(e => console.log(e));
				} else {
					this.setState({ LoginStatus: false, loading: false });
				}

			    gAnalytics.trackEvent('favorites','view',{name : 'FavoritesPage' });		
		
			})
			.catch(err => console.log(err));
	}

	componentDidMount() {}

	onRefresh(token) {
		const { stores } = this.props;
		this.setState({ isFetching: true }, function() {
			this.props.stores.user
				.getMyBookmarks(token)
				.then(res => {
					if (res.status == "success") {
						this.setState({
							LoginStatus: true,
							bookmarks: res.bookmarks,
							token: token,
							loading: false,
							isFetching: false
						});
					} else {
						this.setState({ bookmarks: [] });
					}
				})
				.catch(e => console.log(e));
		});
	}

	handleNav(id, type) {
		if (type == "store") {
			this.props.navigation.navigate("Product", { id: id });
		} else if (type == "designer") {
			this.props.navigation.navigate("DesignerProfile", { id: id });
		} else if (type == "blogger") {
			this.props.navigation.navigate("BloggerProfile", { id: id });
		}
	}

	_renderItem = ({ item }) => {
		return(
			<View>
				<ListItem
					key={item.name}
					roundAvatar
					hideChevron={true}
					
					avatar={<Avatar
						rounded
						small
						source={{
							uri: item.mobile_banner !== ""
								? Config.BaseUrl + item.mobile_banner
								: Config.NoImageUrl
						}}
					/>}
					title={item.name}
					onPress={() => this.handleNav(item.reference_id, item.reference_type)}
				/>
			</View>
			// <TouchableOpacity
			// 	style={{
			// 		backgroundColor: "#fff",
			// 		borderColor: "#ddd",
			// 		borderBottomWidth: 1,
			// 		flexDirection: "row",
			// 		padding: 5
			// 	}}
			// 	key={item.name}
			// 	onPress={() =>
			// 		this.handleNav(item.reference_id, item.reference_type)}>
			// 	<View style={{ width: 70 }}>
			// 		<Image
			// 			style={css.favourite_img}
			// 			source={{
			// 				uri:
			// 					item.mobile_banner !== ""
			// 						? Config.BaseUrl + item.mobile_banner
			// 						: Config.NoImageUrl
			// 			}}
			// 		/>
			// 	</View>

			// 	<Text
			// 		style={{
			// 			fontSize: 18,
			// 			marginBottom: 1,
			// 			marginLeft: 0,
			// 			marginTop: 15
			// 		}}>
			// 		{item.name}
			// 	</Text>
			// </TouchableOpacity>
		);
	};

	_renderHeader = ({ section }) => {
		return (
			<View style={{ padding: 6, backgroundColor : "#ddd",height:35 }}>
				<Text style={{ fontSize: 16, fontWeight: "600", marginLeft: 10 }}>
					{section.key.toUpperCase()}
				</Text>
			</View>
		);
	};

	static navigationOptions = {
		title: "My Favorites",
		gesturesEnabled: false,
		headerMode: "screen",
		tabBarIcon: ({ tintColor }) => (
			<TabBarIcon icon={Images.icons.star} tintColor={tintColor} />
		),
		headerLeft: null
	};

	render() {
		if (this.state.loading) {
			return <SpinkitLarge />;
		} else {
			const { bookmarksdata } = this.props.stores.user;
			const userpresent = this.props.stores.user.isUserPresent;
			if (userpresent) {
				if (bookmarksdata.length) {
					return (
					<View style={Style.container}>
					<SectionList
							keyExtractor={item => item.name}
							renderItem={this._renderItem}
							renderSectionHeader={this._renderHeader}
							sections={bookmarksdata.slice()}
							stickySectionHeadersEnabled={true}
						/>
						
						{/*<View style={Style.fixedFooter}>
							 <TouchableOpacity style={Style.iconFixFooter} onPress={() => this.props.navigation.navigate('Main')}> 
								 <TabBarIcon icon={Images.icons.news} tintColor={'#fff'} />
							 </TouchableOpacity>
							  <TouchableOpacity style={Style.iconFixFooter} onPress={() => this.props.navigation.navigate('Designers')}> 
								 <TabBarIcon icon={Images.icons.user} tintColor={'#fff'} />
							 </TouchableOpacity>
							  <TouchableOpacity style={Style.iconFixFooter} onPress={() => this.props.navigation.navigate('Favorites')}> 
								 <TabBarIcon icon={Images.icons.star} tintColor={'#fff'} />
							 </TouchableOpacity>
						</View>*/}
						
				</View>	
					);
				} else {
					return (
					<View style={Style.container}>
						<View style={[css.wrap_data_in_center, { marginTop: 15 }]}>
							<Text style={{ textAlign: "center", fontSize: 15 }}>
								{" "}Bookmarks not found{" "}
							</Text>
						</View>
						{/*<View style={Style.fixedFooter}>
							 <TouchableOpacity style={Style.iconFixFooter} onPress={() => this.props.navigation.navigate('Main')}> 
								 <TabBarIcon icon={Images.icons.news} tintColor={'#fff'} />
							 </TouchableOpacity>
							  <TouchableOpacity style={Style.iconFixFooter} onPress={() => this.props.navigation.navigate('Designers')}> 
								 <TabBarIcon icon={Images.icons.user} tintColor={'#fff'} />
							 </TouchableOpacity>
							  <TouchableOpacity style={Style.iconFixFooter} onPress={() => this.props.navigation.navigate('Favorites')}> 
								 <TabBarIcon icon={Images.icons.star} tintColor={'#fff'} />
							 </TouchableOpacity>
						</View>*/}
						
				</View>	
						
					);
				}
			} else {
				return (
				
				<View style={Style.container}>
					<View style={[css.wrap_data_in_center, { marginTop: 15 }]}>
						<TouchableOpacity
							style={css.btnLogIn}
							onPress={() =>
								this.props.navigation.navigate(
									"UserProfileScreen"
								)}>
							<Text style={css.btnLogInText}> LOG IN </Text>
						</TouchableOpacity>
					</View>
					
					{/*<View style={Style.fixedFooter}>
							 <TouchableOpacity style={Style.iconFixFooter} onPress={() => this.props.navigation.navigate('Main')}> 
								 <TabBarIcon icon={Images.icons.news} tintColor={'#fff'} />
							 </TouchableOpacity>
							  <TouchableOpacity style={Style.iconFixFooter} onPress={() => this.props.navigation.navigate('Designers')}> 
								 <TabBarIcon icon={Images.icons.user} tintColor={'#fff'} />
							 </TouchableOpacity>
							  <TouchableOpacity style={Style.iconFixFooter} onPress={() => this.props.navigation.navigate('Favorites')}> 
								 <TabBarIcon icon={Images.icons.star} tintColor={'#fff'} />
							 </TouchableOpacity>
					</View>*/}
						
				</View>
				);
			}
		}
	}
}
