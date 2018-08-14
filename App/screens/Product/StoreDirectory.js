"use strict";
import React, { Component } from "react";
import {
    Text,
    View,
    Image,
    TouchableOpacity,
    ScrollView,
    FlatList,
    SectionList,
    StyleSheet,
    AsyncStorage
} from "react-native";
import { Languages, Style, Images, Config, gAnalytics } from "@common";
import { Spinkit,SpinkitLarge, TabBarIcon} from "@components";
import _ from "lodash";
import AtoZList from "react-native-atoz-list";
import { inject, observer, observable } from "mobx-react";
import Icon from "react-native-vector-icons/FontAwesome";
import { SearchBar, ListItem } from "react-native-elements";

@inject("stores")
@observer
export default class BoutiquesScreen extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            partners: [],
            loading: true,
            searching: false,
            searchdata: [],
            search:false,
            query: "",
            lat : null,
            long : null,    
            notfound : false,  
            noresultsfound : false,
        };

        this._renderCell = this._renderCell.bind(this);
        this._renderHeader = this._renderHeader.bind(this);
        
         gAnalytics.trackScreenView('StoreDirectoryPage')
    }


     static navigationOptions = ({ navigation }) => {
        const { navigate } = navigation;
        const { params = {} } = navigation.state;
        return {
          headerTitle: 'Boutiques',
          headerMode: "screen",
          gesturesEnabled: false,
          headerLeft : null,
          headerRight: (
            <TouchableOpacity style={{ width: 50,  }} onPress={() => params.searchbar() }>
              <Icon
                name="search"
                style={{ color: "#E29A0D", marginRight: 0,marginLeft: 10, fontSize: 20 }}
              />
            </TouchableOpacity>
          ),
          tabBarIcon: ({ tintColor }) => (
            <TabBarIcon icon={Images.icons.user} tintColor={tintColor} />
          ),
        };
      };

     // handleSearchFalse = () => {
     //    this.setState({ search: false });
     //  };

  handleSearch = () => {
        if (!this.state.search) {
          this.setState({ search: true });
        } else {
          this.setState({ search: false });
        }
        // this.setState({search : true})
      };

    componentWillMount(){
        /*Check for location data*/
        this.props.stores.location
                  .checkCurrentLocation()
                  .then(res => {
                      if(res){
                        res = JSON.parse(res)
                        this.setState({lat:res.latitude,long:res.longitude})
                      }
                      this.getStores(this.state.lat,this.state.long)
                  })
                  .catch(err => console.log(err))
    }

    getStores(lat,long){
        this.props.stores.partner
            .getBoutiques(lat,long)
            .then(res => {
                if(res.status == 'success'){

                let arr = [];
                res.stores.map(r => {
                    var mid = {
                        id: r.id,
                        store_name: r.store_name,
                        mobile_banner: r.mobile_banner
                    };

                    arr.push(mid);
                });
                let names = _.groupBy(arr, name =>
                    name.store_name[0].toUpperCase()
                );
                this.setState({ partners: names, loading: false });
                }else{
                    this.setState({loading: false,notfound:true });
                }
            })
            .catch(error => console.log(error));
    }

    componentDidMount() {
        this.handleDirectoryAnalytics();
        this.props.navigation.setParams({ searchbar: this.handleSearch });
    }

      setQuery(q) {
            this.setState({ query: q } , () => {
              if(q.length > 1){
                this.setState({searching:true})
                this.props.stores.partner
                  .fetchBoutiques(q,this.state.lat,this.state.long)
                  .then(success => {
                    if(success.length > 0)
                    this.setState({ searchdata: success,noresultsfound:false,searching:false },() => {
                      gAnalytics.trackEvent('storedirectory','search',{query : q});
                    })
                    else
                    this.setState({noresultsfound:true,searching:false})   
                  })
                  .catch(error => {
                    console.log(error);
                  });
              } else {
                this.setState({ searchdata: [],noresultsfound:false });
              }
            });
          }

    handleDirectoryAnalytics(){
         AsyncStorage.getItem("usertoken")
          .then(item => {
            if(item){
              this.props.stores.user.getuserInfoBasic()
                .then(data => {
                    let d = JSON.parse(data)
                    gAnalytics.setUser(d.id.toString());
                }).catch(err => console.log(err))
            }
            gAnalytics.trackEvent('storedirectory','view',{name : 'StoreDirectoryPage'});
          }).catch(e => console.log(e))   
    }      

    _renderHeader(data) {
        return (
            <View
                style={{
                    height: 35,
                    justifyContent: "center",
                    backgroundColor: "#eee",
                    paddingLeft: 10
                }}>
                <Text>{data.sectionId}</Text>
            </View>
        );
    }

    handlePress(id) {
        this.props.navigation.navigate("Product", {id: id})
    }

    _renderCell(data) {
        return (
            <View style={styles.cell}>
                <TouchableOpacity style={styles.cell} activeOpacity={0.9} onPress={() => this.handlePress(data.id)} >
                    <View style={[ styles.placeholderCircle ]}>
                        <Image
                        source={{
                                uri: data.mobile_banner
                                    ? Config.BaseUrl + data.mobile_banner
                                    : Config.NoImageUrl
                            }}
                            style={[
                                styles.placeholderCircleImg
                            ]}
                        />

                    </View>
                    <Text style={styles.name}>{data.store_name}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    /*------------------------Renders boutiques list from search start------------------------*/
  _renderItem = ({ item }) => {
    return (
      <ListItem
        roundAvatar
        hideChevron={true}
        avatar={{ uri: Config.BaseUrl + item.logo_image }}
        key={item.id}
        title={item.store_name}
        onPress={() =>
          this.props.navigation.navigate("Product", { id: item.id })}
      />
    );
  };

      clearQuery(){
        this.setState({query:'',noresultsfound:false})
        this.search.clearText();
    }

    render() {
        if(this.state.search){
          return (<View style={styles.container}>
                      <SearchBar
                      ref={search => this.search = search}
                        lightTheme={true}
                        value={this.state.query}
                        onChangeText={text => {
                          this.setQuery(text);
                        }}
                        placeholder="Search Boutiques..."
                        onClearText={ () => this.clearQuery }
                        clearIcon                        
                      />
                      <ScrollView>
                        {this.state.searching ? (
                          <Spinkit />
                        ) : (this.state.noresultsfound ? <View>
                                    <Text
                                      style={{ marginTop: 15, textAlign: "center", fontWeight: "500" }}>
                                      {'No boutiques found'}
                                    </Text>
                                  </View> :
                          <FlatList
                            data={this.state.searchdata}
                            keyExtractor={item => item.id}
                            renderItem={this._renderItem}
                          />
                        )}
                      </ScrollView>
					  
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
					  
                    </View>)
        }
        else{
        if (!this.state.loading) {
                if(this.state.notfound){
                    return( <View style={styles.container}>
                        <Text
                          style={{ marginTop: 15, textAlign: "center", fontWeight: "500" }}>
                          {'No boutiques found. Come back later!'}
                        </Text>
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
                      </View>)
                }else{
                    const { partners } = this.state;
                    return (
                     <View style={styles.container}>
                        <AtoZList
                            sectionHeaderHeight={35}
                            cellHeight={95}
                            data={partners}
                            renderCell={this._renderCell}
                            renderSection={this._renderHeader}/>
						
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
                   <SpinkitLarge />
                );
            }
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 25,
        backgroundColor: "#fff"
    },
    swipeContainer: {},
    alphabetSidebar: {
        position: "absolute",
        backgroundColor: "transparent",
        top: 0,
        bottom: 0,
        right: 0,
        justifyContent: "center",
        alignItems: "center"
    },
    placeholderCircle: {
        width: 60,
        height: 50,
        borderRadius: 2,
        marginRight: 10,
        marginLeft: 5
    },
    placeholderCircleImg:{
        width: 50,
        height: 50,
        borderRadius: 2,
        marginRight: 10,
        marginLeft: 5
    },
    name: {
        fontSize: 15
    },
    cell: {
        height: 95,
        borderBottomColor: "#ccc",
        borderBottomWidth: 1,
        backgroundColor: "#fff",
        flexDirection: "row",
        alignItems: "center",
        width : '100%'
    }
});
