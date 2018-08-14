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
import { Languages, Style, Images, Config,gAnalytics } from "@common";
import { Spinkit,SpinkitLarge, TabBarIcon } from "@components";
import _ from "lodash";
import AtoZList from "react-native-atoz-list";
import { inject, observer, observable } from "mobx-react";
import { SearchBar, ListItem } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";

@inject("stores")
@observer
export default class BloggerDirectoryScreen extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      bloggers: [],
      loading: true,
      searchdata: [],
      query: "",
      notfound: false,
      noresultsfound : false,
      searching : false,
    };

    this._renderCell = this._renderCell.bind(this);
    this._renderHeader = this._renderHeader.bind(this);

    gAnalytics.trackScreenView('BloggerDirectoryPage');
  }

  componentWillMount(){
    setTimeout(() => {
          this.props.stores.blog
            .getBloggers()
            .then(res => {
              if (res.status == 'success'){
                let arr = [];
                res.bloggers.map(r => {
                  var mid = {
                    id: r.id,
                    blogger_name: r.blogger_name,
                    profile_pic: r.profile_pic
                  };
                   arr.push(mid);
                });
                let names = _.groupBy(arr, name => name.blogger_name[0].toUpperCase());
                this.setState({ bloggers: names, loading: false });
              }else{
                this.setState({notfound:true,loading:false})
              }
        })
        .catch(error => console.log(error));
    },100)
  }

  componentDidMount() {
    /*searchbar*/
    this.props.navigation.setParams({ searchbar: this.handleSearch });
    /*Searchbar---*/
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
        gAnalytics.trackEvent('bloggerdirectory','view',{name : 'BloggerDirectoryPage'});
      }).catch(e => console.log(e))
  }

  handleSearch = () => {
    if (!this.state.search) {
      this.setState({ search: true });
    } else {
      this.setState({ search: false });
    }
    // this.setState({search : true})
  };

  _renderItem = ({ item }) => {
    return (
      <ListItem
        roundAvatar
        hideChevron={true}
        avatar={{ uri: item.profile_pic ? Config.BaseUrl + item.profile_pic : Config.NoImageUrl }}
        key={item.id}
        title={item.blogger_name}
        onPress={() =>
          this.props.navigation.navigate("BloggerProfile", { id: item.id })}
      />
    );
  };

  setQuery(q) {
    this.setState({ query: q });
    if (q.length > 1) {
      this.setState({searching:true})
      this.props.stores.blog
        .fetchBloggers(q)
        .then(success => {
          if(success.length > 0){
            this.setState({ searchdata: success,noresultsfound:false,searching:false },() => {
              gAnalytics.trackEvent('bloggerdirectory','search',{query : q,resultcount : searchdata.length});
            });
          }else{
            this.setState({noresultsfound:true,searching:false})   
          }
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      this.setState({ searchdata: [],noresultsfound:false });
    }
  }

    clearQuery(){
      this.setState({query:'',noresultsfound:false})
      this.search.clearText();
    }

  static navigationOptions = ({ navigation }) => {
    const { navigate } = navigation;
    const { params = {} } = navigation.state;
    return {
      title: "Bloggers",
      headerMode: "screen",
      tabBarIcon: ({ tintColor }) => (
        <TabBarIcon icon={Images.icons.user} tintColor={tintColor} />
      ),
      headerRight: ( 
        <TouchableOpacity
          style={{ width: 50 }}
          onPress={() => params.searchbar()}>
          <Icon
            name="search"
            style={{
              color: "#E29A0D",
              marginRight: 0,
              marginLeft: 10,
              fontSize: 20
            }}
          />
        </TouchableOpacity>
      ),
      headerLeft: null
    };
  };

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
    this.props.navigation.navigate("BloggerProfile", { id: id });
  }

  _renderCell(data) {
    return (
       <View style={styles.cell}>
                <TouchableOpacity style={styles.cell} activeOpacity={0.9} onPress={() => this.handlePress(data.id)} >
                    <View style={[ styles.placeholderCircle ]}>
                        <Image
                        source={{
                                uri: data.profile_pic
                                    ? Config.BaseUrl + data.profile_pic
                                    : Config.NoImageUrl
                            }}
                            style={[
                                styles.placeholderCircleImg
                            ]}/>

                    </View>
                    <Text style={styles.name}>{data.blogger_name}</Text>
                </TouchableOpacity>
            </View>
    );
  }

  render() {
    if (this.state.search) {
      return (
        <View>
          <SearchBar
          ref={search => this.search = search}
            lightTheme={true}
            value={this.state.query}
            onChangeText={text => {
              this.setQuery(text);
            }}
            placeholder="Search Bloggers..."
             onClearText={ () => this.clearQuery }
             clearIcon
          />
          {this.state.searching ? (
            <Spinkit />
          ) : (this.state.noresultsfound ? <View>
                                    <Text
                                      style={{ marginTop: 15, textAlign: "center", fontWeight: "500" }}>
                                      {'No bloggers found'}
                                    </Text>
                                  </View> :
            <FlatList
              data={this.state.searchdata}
              keyExtractor={item => item.id}
              renderItem={this._renderItem}
            />
          )}
        </View>
      );
    } else {
      if (!this.state.loading) {
        if (this.state.notfound){
              return (
                      <View>
                        <Text
                          style={{ marginTop: 15, textAlign: "center", fontWeight: "500" }}>
                          {'No bloggers found. Come back later!'}
                        </Text>
                      </View>
                    )
            }else{
              const { bloggers } = this.state;
              return (
              
                <AtoZList
                  sectionHeaderHeight={35}
                  cellHeight={218}
                  data={bloggers}
                  renderCell={this._renderCell}
                  renderSection={this._renderHeader}
                />

                  

              );
            }
      } else {
        return <SpinkitLarge />;
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
        borderRadius: 25,
        marginRight: 10,
        marginLeft: 5
    },
    placeholderCircleImg:{
        width: 50,
        height: 50,
        borderRadius: 25,
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
