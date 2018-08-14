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
	Keyboard,
	ToastAndroid
} from "react-native";
import { NavigationActions } from "react-navigation";
import { Spinkit, TabBarIcon } from "@components";
import { Languages, Style, Images, Config } from "@common";
import { inject, observer, observable } from "mobx-react";
import { SearchBar, ListItem } from "react-native-elements";
import css from "../SignIn/style";
import styles from "../../../styles";

@inject("stores")
@observer
export default class SearchGlobalScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			page: 1,
			notfound: false,
			loading: false,
			query: "",
			alldone: false,
			loadingrequired: true,
			loadmoretext: false,
			dataupdated: false,
			catdata: [],
			showBlock : true
		};
	}

	static navigationOptions = {
		title: "Search",
		headerMode: "screen"
	};

	componentWillMount() {
		this.props.stores.home
			.getHomeData()
			.then(res => {
				if (res) {
					this.setState({
						catdata: this.props.stores.home.homedata
					})
				}
			})
			.catch(e => console.log(e));
	}

	clearQuery() {
		this.setState({
			query: "",
			data: [],
			page: 1,
			showBlock : true
		});
	}

	setQuery(q) {
		if (q.length == 0) {
			this.setState({
				query: "",
				data: [],
				page: 1,
				notfound: false,
				loadmoretext: false,
				loading: false,
				showBlock : false
			});
		} else {
			console.log("gone")
			this.setState({
				query: q
			}, () => {
				this.setState({ data: [] })
				this.getResult(q, 1, true)
			});
		}
	}

	handleSearch(event) {
		if (this.state.query.length > 1) {
			this.setState({ notfound: false })
			this.search.blur();
			this.getResult(this.state.query, this.state.page, true);
		}
	}

	getResult(q, p, isloadingrequired) {
		if (isloadingrequired) {
			this.setState({ loading: true });
		}
		this.props.stores.misc
			.search(q, p)
			.then(res => {
				// console.log("page :" + p);
				// console.log("result");
				// console.log(res);
				if (p == 1 && res.status !== "success") {
					this.setState({ notfound: true });
				} else {
					if (res.status == "success") {
						if (res.results.length > 0) {
							this.setState(state => ({
								data: [...state.data, ...res.results],
								loading: false,
								loadmoretext: true,
								dataupdated: true,
								showBlock : false
							}));
						}
					} else {
						this.setState({
							alldone: true,
							loading: false,
							dataupdated: false,
							showBlock : false
						});
					}
				}
			})
			.catch(e => console.log(e));
	}

	handleNav(type, id) {
		const { navigate } = this.props.navigation;

		if (type == "store") {
			navigate("Product", { id: id });
		} else if (type == "blogger") {
			navigate("BloggerProfile", { id: id });
		} else if (type == "designer") {
			navigate("DesignerProfile", { id: id });
		} else {
			console.log("new type");
		}
	}

	LoadMore() {
		if (this.state.alldone) {
			this.setState({ loadmoretext: false });
		} else {
			this.setState(
				{
					page: this.state.page + 1
				},
				() => {
					this.getResult(this.state.query, this.state.page, false);
				}
			);
		}
	}

	_renderFooter = () => {
		if (this.state.loadmoretext && this.state.data.length > 9) {
			return (
				<View>
					<TouchableOpacity onPress={() => this.LoadMore()}>
						<Text
							style={{
								textAlign: "center",
								fontSize: 15,
								marginTop: 16,
								marginBottom: 10,
								fontWeight: "500",
								showBlock: false
							}}>
							{"Load More "}
						</Text>
					</TouchableOpacity>
				</View>
			);
		} else {
			return null;
		}
	};

	_renderItem = ({ item, index }) => {
		return (
			<View>
				<ListItem
					key={item.name}
					roundAvatar
					hideChevron={true}
					avatar={{
						uri: item.image
							? Config.BaseUrl + item.image
							: Config.NoImageUrl
					}}
					title={item.name}
					subtitle={item.type.toUpperCase()}
					onPress={() => {
						Keyboard.dismiss()
						this.handleNav(item.type, item.id)
					}}
				/>
			</View>
		);
	};

	_renderItemCats = ({item,index}) => {
		return(
			<View>
				<ListItem
					key={item.id}
					roundAvatar
					hideChevron={true}
					avatar={{
						uri: item.thumbnail
							? Config.BaseUrl + item.thumbnail
							: Config.NoImageUrl
					}}
					title={item.name}
					onPress={() =>
						this.props.navigation.navigate("Listing", { cid: item.id, name: item.name })}
				/>
			</View>
			
		)
	}
	/* <TouchableOpacity
				key={item.id}
				style={styles.browseCategory_col}
				onPress={() =>
					this.props.navigation.navigate("Listing", { cid: item.id, name: item.name })}>
				<Image
					style={styles.browseCategory_img}
					source={{
						uri: item.thumbnail
							? Config.BaseUrl + item.thumbnail
							: Config.NoImageUrl
					}} />
				<Text style={styles.browseCategory_desc}>
					{item.name}
				</Text>
			</TouchableOpacity> */

	render() {
		let hct = this.props.stores.home.homedata;
		return (
		<View style={styles.container}>
			<ScrollView
				keyboardShouldPersistTaps={'handled'}
				ref={ref => (this.scrollView = ref)}
				onContentSizeChange={(contentWidth, contentHeight) => {
					if (this.state.dataupdated && this.state.page > 1) {
						this.scrollView.scrollToEnd({ animated: true });
					}
				}}>


				<View>
					<SearchBar
						noIcon
						ref={search => (this.search = search)}
						lightTheme={true}
						value={this.state.query}
						onChangeText={text => {
							this.setQuery(text);
						}}
						onFocus={() => { this.setState({ showBlock:false})}}
						onBlur={() => { this.setState({ showBlock: true })}}
						onClearText={() => this.clearQuery()}
						placeholder="Search Boutiques,Designers,Bloggers..."
						onSubmitEditing={event => this.handleSearch(event)}
						returnKeyType={"search"}
						clearIcon={{ name: "clear" }} />
				{
						this.state.showBlock ?
							<View>
								<Text
									style={{
										textAlign: "center",
										fontSize: 12,
										marginTop: 8,
										marginBottom: 10,
										fontWeight: "500"
									}}>
									{'Browse categories'}
						</Text>
							<FlatList
								data={hct}
								keyboardShouldPersistTaps={'handled'}
								keyExtractor={item => item.id}
								renderItem={this._renderItemCats}
								/>
						</View>
							
						 : null
						}		
				</View>
				{this.state.notfound ? (
					<View>
						<Text
							style={{
								textAlign: "center",
								fontSize: 15,
								marginTop: 16,
								marginBottom: 10,
								fontWeight: "500"
							}}>
							Result not found...
						</Text>
					</View>
				) : this.state.loading ? (
					<Spinkit />
				) : (
							<FlatList
								data={this.state.data}
								keyboardShouldPersistTaps={'handled'}
								keyExtractor={item => item.id}
								renderItem={this._renderItem}
								ListFooterComponent={this._renderFooter}
							/>
						)}
			</ScrollView>
			
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