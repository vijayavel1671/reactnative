import React, { Component } from "react";
import {
  Dimensions,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  ScrollView,
  AsyncStorage,
  Alert
} from "react-native";
import { SpinkitLarge,TabBarIcon } from "@components";
import { Languages, Style, Config,gAnalytics,Images } from "@common";
import styles from "../../../styles";
import { RkModalImg } from "react-native-ui-kitten";
import { inject, observer } from "mobx-react";
import Icon from "react-native-vector-icons/FontAwesome";
import ImagePicker from "react-native-image-picker";
import Gallery from 'react-native-photo-gallery';


@inject("stores")
@observer
export default class UserGalleryScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      shown: false,
      curIndex: 0,
      images: [],
      loading: true,
      noimage: false,
      storeid: null,
      photo: null
    };

    gAnalytics.trackScreenView('UserGalleryPage');
    
  }

 static navigationOptions = ({ navigation }) => {
    const { navigate } = navigation;
    const { params = {} } = navigation.state;
    return {
      headerTitle: 'User Gallery',
      headerRight: (
        <View style={{ width: 120, flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'flex-end' }}>
          <TouchableOpacity
            activeOpcaity={0.9}
            style={{ width: 40,marginRight:8 }}
            onPress={() => params.handleuserUpload()}>
            <Icon
              name="cloud-upload"
              style={{
                color: "#000",
                fontSize: 24
              }} />
          </TouchableOpacity>

        </View>
      ),
    };
  };

  componentWillMount() {
    let paramId = this.props.navigation.state.params.stid;
    this.setState({ storeid: paramId });
    this.props.stores.partner
      .getStoreUserGallery(paramId)
      .then(res => {
        if (res.status == "success") {
          var arr = [];
          if (res.store_user_gallery.length > 0) {
            res.store_user_gallery.map((item,index) => {
              arr.push(
              {
                  id: index,
                  image: { uri: Config.BaseUrl + item.image },
                  thumb: { uri: Config.BaseUrl + item.image }
              }
              );
            });

            this.setState({ loading: false, images: arr });
          } else {
            this.setState({ loading: false, noimage: true });
          }
        } else {
          this.setState({ loading: false, noimage: true });
        }
      })
      .catch(err => console.log(err));
  }


  componentDidMount(){
    this.props.navigation.setParams({ handleuserUpload : this.UserUpload });
  }

  UserUpload = () => {
    console.log("Open user uplaod")
     this.uploadUserImage()
  }

   handleAnalytics(){
      AsyncStorage.getItem("usertoken")
      .then(item => {
        if(item){
          this.props.stores.user.getuserInfoBasic()
            .then(data => {
                let d = JSON.parse(data)
                gAnalytics.setUser(d.id.toString());
            }).catch(err => console.log(err))
        }
          gAnalytics.trackEvent('usergallery','view',{name : 'UserGalleryPage'});

      }).catch(e => console.log(e))
 } 


  uploadUserImage = () => {
    AsyncStorage.getItem("usertoken").then(item => {
      if (!item) {
        Alert.alert("You are not logged in");
      } else {
        const options = {
          quality: 1.0,
          maxWidth: 500,
          maxHeight: 500,
          storageOptions: {
            skipBackup: true
          }
        };

        ImagePicker.showImagePicker(options, response => {
          if (response.didCancel) {
            console.log("User cancelled photo picker");
          } else if (response.error) {
            console.log("ImagePicker Error: ", response.error);
          } else if (response.customButton) {
            console.log("User tapped custom button: ", response.customButton);
          } else {
            let source = { uri: response.uri };
            // You can also display the image using data:
            // let source = { uri: 'data:image/jpeg;base64,' + response.data };
            this.setState(
              {
                photo: response.uri
              },
              () => {
                this.setState({ loading: true });
                let uploaddata = {
                  token: item,
                  store_id: this.state.storeid,
                  image: this.state.photo
                };
                this.props.stores.user
                  .uploadusergall(uploaddata)
                  .then(result => {

                    if (result.status == "success") {
                      Alert.alert(
                              result.message,
                              null,
                              [{
                                      text: "OK",
                                      onPress: () => this.props.navigation.goBack()
                              }],
                              { cancelable: false });
                      this.setState({
                        loading: false,
                        photo: null
                      });
                    } else {
                      Alert.alert(result.message);
                    }
                  })
                  .catch(e => console.log(e))
              });
          }
        });
      }
    });
  }

  _renderHeader(options) {
    return (
      <View style={styles2.header}>
        <TouchableOpacity onPress={options.closeImage}>
          <Text style={{ color: "#fff" }}>Close</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text
            style={{ color: "#fff" }}
          >{`${options.pageNumber}/${options.totalPages}`}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    let size = (Dimensions.get("window").width - 12) / 3;

    if (this.state.loading) {
      return <SpinkitLarge />;
    } else {
      if (this.state.noimage) {
        return (
          <View style={styles.container}>
              <Icon
                style={[
                    { fontSize: 40,textAlign:'center', marginTop: 150  }
                ]}
                name="cloud-upload"
                onPress={this.uploadUserImage}
              />
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              No Gallery Image Found.Be the first one to upload.

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
        );
      } else {
        return (
		
			<View style={styles.container}>
			<View style={{flexDirection: 'row',flex:1, marginBottom:50}}>
              <Gallery
                initialNumToRender={2}
                data={this.state.images} />
				
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
let styles2 = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between"
  }
});
