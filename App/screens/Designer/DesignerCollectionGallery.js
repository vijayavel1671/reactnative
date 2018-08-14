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
import Gallery from 'react-native-photo-gallery';

@inject("stores")
@observer
export default class DesignerCollectionGalleryScreen extends Component{
  constructor(props) {
    super(props);

    this.arr = [];

    this.state = {
      shown: false,
      curIndex: 0,
      images: [],
      loading: true,
      noimage: false,
      ModalOpen:false,
      dcid : null
    };

    gAnalytics.trackScreenView('DesignerCollectionGalleryPage')
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

  static navigationOptions = {
    title: "Designer Collection"
  };

  componentWillMount() {
    let paramId = this.props.navigation.state.params.coll_id;
    this.setState({dcid : paramId} , () => {
        this.handleAnalytics()
    })

    this.props.stores.designer
      .getDesignerGallery(paramId)
      .then(res => {
        if (res.status == "success") {
          if (res.collection_images.length > 0) {
            res.collection_images.map((item, index) => {
              this.arr.push(
                {
                  id: index,
                  image: { uri: Config.BaseUrl + item.image },
                  thumb: { uri: Config.BaseUrl + item.image }
                });
            });
            setTimeout(() => {
              this.setState({ loading: false, images: this.arr });
            },500)
          } else {
            this.setState({ loading: false, noimage: true });
          }
        } else {
          this.setState({ loading: false, noimage: true });
        }
      })
      .catch(err => console.log(err));
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
          gAnalytics.trackEvent('designercollection','view',{name : 'DesignerCollectionGalleryPage'});
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
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
});