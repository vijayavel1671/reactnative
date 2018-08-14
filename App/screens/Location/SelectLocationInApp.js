"use strict";
import React, { Component } from "react";
import {
	Text,
	View,
	Image,
	TouchableOpacity,
	TextInput,
	Platform,
	ScrollView,
	FlatList,
	AsyncStorage,
	Alert,
	Keyboard,
	PermissionsAndroid,
	Modal
} from "react-native";
import css from "./style";
import { SpinkitLarge, TabBarIcon } from "@components";
import { Languages, Style, Config, gAnalytics, Images } from "@common";
import { inject, observer } from "mobx-react";
import { SearchBar, ListItem } from "react-native-elements";
import { NavigationActions } from "react-navigation";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import Permissions from 'react-native-permissions'
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
import DeviceSettings from 'react-native-device-settings';
import styles from "../../../styles";

@inject("stores")
@observer
export default class SelectLocationInAppcreen extends Component {
	static navigationOptions = {
		title: "Change Location",
		headerMode: "screen"
	};

	constructor(props) {
		super(props);

		this.state = {
			query: "",
			searchdata: false,
			searchresults: [],
			searching: false,
			latitude: 0,
			longitude: 0,
			error: null,
			hidePopular: false,
			hideHome: false,
			iosModalVisible: false
		};

		gAnalytics.trackScreenView("SelectLocationPage");
	}

	/*Location*/
	componentWillMount() { }
	/*Auto Detection....*/
	_getLocationAsync = () => {
		this.setState({ loading: true }, () => {

			if (Platform.OS == 'android') {
				// console.log(PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION))
				PermissionsAndroid.request(
					PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
				).then(granted => {
					//  console.log("Request permission result : ",granted);
					if (granted == 'never_ask_again') {
						this.setState({ loading: false }, () => {
							Alert.alert('Location permission',
								'Change app permissions and try again.',
								[{ text: 'Cancel', onPress: () => console.log('cancelled'), style: 'cancel' },
								{
									text: 'Settings',
									onPress: () => {
										DeviceSettings.app()
									}
								}],
								{ cancelable: false })
						})
					} else {
						/* get location code */
						this.getLocation()
					}
				}).catch(e => console.log(e))
			} else {

				// First check for location
				this.getLocation()

			}
		})

	};


	checkLocationPermissionIos() {
		// IOS check for permission
		Permissions.check('location', { type: 'whenInUse' }).then(response => {
			if (response !== 'authorized') {
				Permissions.request('location', { type: 'whenInUse' }).then(response => {
					// this.setState({ locationPermission: response })
					if (response == 'denied') {
						Alert.alert('Location Disabled',
							'Location services need to be turned on',
							[{ text: 'Cancel', onPress: () => this.props.navigation.goBack(), style: 'cancel' },
							{
								text: 'Open Settings',
								onPress: () => {
									Permissions.openSettings().then(res => {
										console.log("IOS res>>>", res);

										this.getLocation()
									}).catch(e => console.log(e))
								}
							}],
							{ cancelable: false })
					} else {
						this.getLocation()
					}
				}).catch(err => console.log("Permissions Error", err))
			} else {
				this.getLocation()
			}
		}).catch(e => console.log(e))
	}

	getLocation() {
		navigator.geolocation.getCurrentPosition(
			position => {
				this.props.stores.location
					.getLocationData(
						position.coords.latitude,
						position.coords.longitude
					)
					.then(success => {
						let d = JSON.parse(success);
						let loc_param = null;
						if (d.sublocality_level_2) {
							loc_param = d.sublocality_level_2;
						} else if (d.sublocality_level_1) {
							loc_param = d.sublocality_level_1;
						} else if (d.locality) {
							loc_param = d.locality;
						}

						AsyncStorage.setItem("locationdata", success)
							.then(() => {
								this.setState({ loading: false }, () => {
									this.handleAnalytics(loc_param, 'autodetect')
								});
								this.props.navigation.navigate("Main", {
									location: loc_param
								});
							})
							.catch(e => console.log(e));
					})
					.catch(error => {
						console.log(error);
					});
			},
			error => {
				console.log(error)
				if (error.code == 3) {
					this._getLocationAsync()
				} else {
					if (Platform.OS == 'android') {
						this.checkIsLocation()
							.then(res => {
								if (res) {
									this._getLocationAsync()
								} else {
									this.setState({ loading: false })
								}
							}
							).catch(error => error);
					} else {
						if (error.code == 1) {
							this.checkLocationPermissionIos()
						} else {

							this.setState({ loading: false, iosModalVisible: true })
						}
					}
				}
			}
		);
	}

	async checkIsLocation() {
		let check = await LocationServicesDialogBox.checkLocationServicesIsEnabled({
			message: "Allow Zingbi to change your device settings",
			ok: "YES",
			cancel: "NO",
			enableHighAccuracy: true, // true => GPS AND NETWORK PROVIDER, false => GPS OR NETWORK PROVIDER
			showDialog: true, // false => Opens the Location access page directly
			openLocationServices: true, // false => Directly catch method is called if location services are turned off
			preventOutSideTouch: false, //true => To prevent the location services window from closing when it is clicked outside
			preventBackClick: false //true => To prevent the location services popup from closing when it is clicked back button
		}).catch(error => error);

		return Object.is(check.status, "enabled");
	}

	handleLocationData(data) {

		let arrAddress = data.address_components;
		let locationdata = {};
		for (var i = 0; i < arrAddress.length; i++) {
			if (arrAddress[i].types[0] == "locality") {
				locationdata["locality"] = arrAddress[i].long_name;
			}

			if (
				arrAddress[i].types[1] == "sublocality" &&
				arrAddress[i].types[0] == "sublocality_level_1"
			) {
				//Checking if got any manual name
				locationdata["sublocality_level_1"] = arrAddress[i].long_name;
			}

			if (
				arrAddress[i].types[0] == "sublocality" &&
				arrAddress[i].types[1] == "sublocality_level_1"
			) {
				locationdata["sublocality_level_1"] = arrAddress[i].long_name;
			}

			if (
				arrAddress[i].types[1] == "sublocality" &&
				arrAddress[i].types[0] == "sublocality_level_2"
			) {
				//Checking if got any manual name
				locationdata["sublocality_level_2"] = arrAddress[i].long_name;
			}

			if (
				arrAddress[i].types[0] == "sublocality" &&
				arrAddress[i].types[1] == "sublocality_level_2"
			) {
				locationdata["sublocality_level_2"] = arrAddress[i].long_name;
			}
		}

		locationdata["latitude"] = data.geometry.location.lat;
		locationdata["longitude"] = data.geometry.location.lng;

		/*Save data locally*/
		AsyncStorage.setItem("locationdata", JSON.stringify(locationdata))
			.then(success => { }).catch(e => console.log(e));

		if (locationdata.sublocality_level_2) {
			this.handleAnalytics(locationdata.sublocality_level_2, 'manual')
			this.props.navigation.navigate("Main", {
				location: locationdata.sublocality_level_2
			});
		} else if (locationdata.sublocality_level_1) {
			this.handleAnalytics(locationdata.sublocality_level_1, 'manual')
			this.props.navigation.navigate("Main", {
				location: locationdata.sublocality_level_1
			});
		} else if (locationdata.locality) {
			this.handleAnalytics(locationdata.locality, 'manual')
			this.props.navigation.navigate("Main", {
				location: locationdata.locality
			});
		}
	}

	handleAnalytics(l, t) {
		AsyncStorage.getItem("usertoken")
			.then(item => {
				if (item) {
					this.props.stores.user.getuserInfoBasic()
						.then(data => {
							let d = JSON.parse(data)
							gAnalytics.setUser(d.id.toString());
						}).catch(err => console.log(err))
				}
				gAnalytics.trackEvent('selectlocation', 'view',
					{ name: 'SelectLocationPage', location: l, type: t });
			}).catch(e => console.log(e))
	}

	handleManual = (place, lat, long) => {
		let locationdata = {};
		locationdata['locality'] = place
		locationdata['sublocality_level_1'] = place
		locationdata['sublocality_level_2'] = place
		locationdata["latitude"] = lat;
		locationdata["longitude"] = long;

		AsyncStorage.setItem("locationdata", JSON.stringify(locationdata))
			.then(success => {
				this.handleAnalytics(place, 'manual')
				this.props.navigation.navigate("Main", {
					location: place
				});
			}).catch(e => console.log(e));
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
		if (this.state.loading) {
			return <SpinkitLarge />;
		} else {
			return (
				<View style={[styles.Container]}>
					<ScrollView style={{ height: '100%' }}
						keyboardShouldPersistTaps={true}
						onScroll={this.onScrollEvent}>
						<Modal
							animationType={"slide"}
							transparent={true}
							visible={this.state.iosModalVisible}
							onRequestClose={() => {
								console.log("Modal has been closed.");
							}}>
							<View style={{ height: '45%', width: '70%', backgroundColor: '#fff', alignSelf: 'center', top: '25%', elevate: 10 }} >
								<View style={{ marginLeft: 18 }} >

									<Text style={{ marginTop: 15, fontSize: 16, fontWeight: '500' }} >
										Location services are disabled
							</Text>
									<Text style={{ fontSize: 13, marginTop: 10 }} >
										{'Turn on Location Services for your iPhone'}
									</Text>
									{/* Instructions view */}


									<Text style={{ marginTop: 10 }} >
										{'1. Open the Settings app'}
									</Text>
									<Text style={{ marginTop: 10 }} >
										{'2. Select Privacy'}
									</Text>
									<Text style={{ marginTop: 10 }} >
										{'3. Select Location Services'}
									</Text>
									<Text style={{ marginTop: 10 }} >
										{'4. Turn on Location Services'}
									</Text>
								</View>

								<TouchableOpacity style={{ right: '6%', bottom: '4%', position: 'absolute',padding:8 }}
									onPress={() => this.setState({ iosModalVisible: false })}	 >
									<Text style={{ fontSize: 16, fontWeight: '500', color: '#d43' }} >{'OK'}</Text>
								</TouchableOpacity>

							</View>
						</Modal>
						<View
							style={
								([css.wrap_data_in_center],
									{ paddingTop: 15, alignItems: "center" })
							}>
							<TouchableOpacity
								style={[Style.darkButton, { width: "85%" }]}
								onPress={this._getLocationAsync}>
								<Text style={[Style.darkButtonTxt]}>
									{'Detect Location'}
								</Text>
							</TouchableOpacity>
						</View>

						{/*AutoComplete the search query*/}

						<GooglePlacesAutocomplete
							placeholder="Search"
							minLength={2} // minimum length of text to search
							autoFocus={false}
							fetchDetails={true}
							onPress={(data, details = null) => {
								Keyboard.dismiss()
								this.handleLocationData(details);
							}}
							getDefaultValue={() => {
								return ""; // text input default value
							}}
							textInputProps={{
								onFocus: () => { this.setState({ hidePopular: true }) },
								onBlur: () => { this.setState({ hidePopular: false }) }
							}}

							query={{
								key: "AIzaSyAQRGhvUNAyBHth3VXOEQeTw35nmaEu1WI",
								language: "en", // language of the results
								region: "in"
							}}
							enablePoweredByContainer={true}
							styles={{
								description: {
									fontWeight: "bold"
								},
								predefinedPlacesDescription: {
									color: "#1faadb"
								}
							}}
							currentLocation={false} // Will add a 'Current location' button at the top of the predefined places list
							currentLocationLabel="Current location"
							nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
							predefinedPlacesAlwaysVisible={false}
						/>

						{
							!this.state.hidePopular ?
								<View>
									<Text style={{ marginTop: 3, marginLeft: 10, fontWeight: '500', fontSize: 22 }} >
										{'Popular Places'}
									</Text>
									<View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'space-between' }} >

										<TouchableOpacity
											activeOpacity={0.9}
											onPress={() => this.handleManual('Chennai', '13.0827', '80.2707')}
											style={[Style.darkButton, { width: "30%", marginLeft: 10 }]}>
											<Text style={{ textAlign: 'center', fontWeight: '500', fontSize: 14 }}>{'Chennai'}</Text>
										</TouchableOpacity>

										<TouchableOpacity
											activeOpacity={0.9}
											onPress={() => this.handleManual('Bengaluru', '12.9716', '77.5946')}
											style={[Style.darkButton, { width: "30%" }]}>
											<Text style={{ textAlign: 'center', fontWeight: '500', fontSize: 14 }}>{'Bengaluru'}</Text>
										</TouchableOpacity>

										<TouchableOpacity
											activeOpacity={0.9}
											onPress={() => this.handleManual('Hyderabad', '17.3850', '78.4867')}
											style={[Style.darkButton, { width: "30%", marginRight: 10 }]} >
											<Text style={{ textAlign: 'center', fontWeight: '500', fontSize: 14 }} >{'Hyderabad'}</Text>
										</TouchableOpacity>

									</View>
								</View> : null
						}

					</ScrollView>
					
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
							<View style={[Style.fixedFooter, {
								width: 50, height: 50, borderRadius: 100,
								right: '4%', bottom: '3%', flex: 1, flexDirection: 'row', justifyContent: 'flex-end'
							}]}>
								<TouchableOpacity style={Style.iconFixFooter} onPress={() => this.props.navigation.goBack()}>
									<TabBarIcon icon={Images.icons.news} tintColor={'#fff'} />
								</TouchableOpacity>
							</View> : null
						*/}

				</View>
			);
		}
	}
}