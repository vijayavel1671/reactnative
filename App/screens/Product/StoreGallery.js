import React, { Component } from "react";
import {
  Dimensions,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Text,
  AsyncStorage
} from "react-native";
import { SpinkitLarge,TabBarIcon } from "@components";
import { Languages, Style, Config,gAnalytics,Images } from "@common";
import styles from "../../../styles";
import { inject, observer } from "mobx-react";
import {RkModalImg} from 'react-native-ui-kitten';
import Icon from "react-native-vector-icons/FontAwesome";
import Share, {ShareSheet} from 'react-native-share';
import Gallery from 'react-native-photo-gallery';

@inject("stores")
@observer
export default class StoreGalleryScreen extends Component{
  constructor(props) {
    super(props);
    this.state = {
      shown: false,
      curIndex: 0,
      images: [],
      loading: true,
      noimage: false,
      ModalOpen:false
    };

    gAnalytics.trackScreenView('StoreGalleryPage')
    
}

  _renderHeader(options) {
    return (
      <View style={styles2.header}>
        <TouchableOpacity onPress={options.closeImage}><Text style={{ color : '#fff' }}>Close</Text></TouchableOpacity>
        <TouchableOpacity>
          <Text style={{ color : '#fff' }}>{`${options.pageNumber}/${options.totalPages}`}</Text>
        </TouchableOpacity>
      </View>
    );
}

share = (p) => {
   let paramId2 = this.props.navigation.state.params.stid;
  let img = this.arr[p - 1].uri ;
   let shareOptions = {
      title: "Zingbi",
      url: Config.storeUrl+paramId2,
      type: 'image/png',
      subject: "Zingbi Store" //  for email
    };
   Share.open(shareOptions);
    
}


_renderFooter(options){
    return (
               <TouchableOpacity style={{ marginRight: 10,height: 30,marginBottom : 5 }} 
                  onPress ={ () => this.share(options.pageNumber)}>
                  <Text
                    style={{
                      fontSize: 20,
                      marginLeft : 10,
                      marginRight: 5,
                      borderRadius: 15,
                      fontWeight: "600",
                      color: "#fff",
                      padding: 5
                    }}>
                    {" "}
                    <Icon name="share" size={17} color="#fff" /> Share{" "}
                  </Text>
                </TouchableOpacity>
    );
}



  static navigationOptions = {
    title: "Store Gallery"
  };

  componentWillMount() {
   
     let paramId = this.props.navigation.state.params.stid;
    this.props.stores.partner
      .getStoreGallery(paramId)
      .then(res => {
        if (res.status == "success") {
          this.arr = [];
          if(res.gallery_images.length > 0) {
            res.gallery_images.map((item,index) => {
              this.arr.push(
                {
                  id: index,
                  image: { uri: Config.BaseUrl + item.image },
                  thumb: { uri: Config.BaseUrl + item.image }
                }
            );
            });
            this.setState({ loading: false, images: this.arr });
          } else {
            this.setState({ loading: false, noimage: true });
          }
        } else {
          this.setState({ loading: false, noimage: true });
        }
      })
      .catch(err => console.log(err));

    this.handleAnalytics();
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
          gAnalytics.trackEvent('storegallery','view',{name : 'StoreGalleryPage'});

      }).catch(e => console.log(e))
 } 

  openViewer(index) {
    this.setState({
      shown: true,
      curIndex: index,
      ModalOpen : true
    });
  }

  closeViewer() {
    this.setState({
      shown: false,
      curIndex: 0
    });
  }

  render() {
     let size = (Dimensions.get('window').width - 12 ) / 3;
    if (this.state.loading) {
      return <SpinkitLarge />;
    } else {
      if (this.state.noimage) {
        return (
          <View style={styles.container}>
            <Text style={{ textAlign: "center", marginTop: 60 }}>
              No Gallery Image Found
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
		 <View style={Style.container}>
		 
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
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
});

// renderFooter={this._renderFooter.bind(this)}