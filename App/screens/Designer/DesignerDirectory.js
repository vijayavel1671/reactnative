"use strict";
import React, { Component } from "react";
import {
    Text,
    View,
    Image,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    AsyncStorage,
    ScrollView
} from "react-native";
import { Languages, Style, Images, Config,gAnalytics } from "@common";
import { Spinkit,SpinkitLarge, TabBarIcon } from "@components";
import _ from "lodash";
import AtoZList from "react-native-atoz-list";
import { inject, observer, observable } from "mobx-react";
import { SearchBar, ListItem } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";


// let names = require("./names");
const dir = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','#']

@inject("stores")
@observer
export default class DesignerDirectoryScreen extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            designers: [],
            loading: true,
            searchdata: [],
            query: "",
            notfound : false,
            noresultsfound : false,
            searching : false,
        };

        gAnalytics.trackScreenView('DesignerDirectoryPage')

        this._renderCell = this._renderCell.bind(this);
        this._renderHeader = this._renderHeader.bind(this);
    }

    static navigationOptions = ({ navigation }) => {
        const { navigate } = navigation;
        const { params = {} } = navigation.state;


        return {
            title: "Designers",
            headerMode: "screen",
            headerRight: (
                <TouchableOpacity
                    style={{ width: 50 }}
                    onPress={() => params.searchbar()}>
                    <Icon
                        name={"search"}
                        style={{
                            color: "#E29A0D",
                            marginRight: 0,
                            marginLeft: 10,
                            fontSize: 20
                        }}
                    />
                </TouchableOpacity>
            ),
            tabBarIcon: ({ tintColor }) => (
                <TabBarIcon icon={Images.icons.user} tintColor={tintColor} />
            ),
            headerLeft: null
        };
    };

    componentWillMount(){
    setTimeout(() => {   
        this.props.stores.misc
            .getDesigners()
            .then(res => {
                if(res.status == 'success'){
                        let arr = [];
                        res.designers.map(r => {
                            var mid = {
                                id: r.id,
                                designer_name: r.designer_name,
                                profile_pic: r.profile_pic
                            };
                            arr.push(mid);
                        });
                    let names = _.groupBy(arr, name =>
                        name.designer_name[0].toUpperCase()
                    );
                    this.setState({ designers: names, loading: false });
                }else{
                    this.setState({
                        notfound : true,
                        loading : false
                    })
                }
            })
            .catch(error => console.log(error));
        },100);            
    }


    componentDidMount() {
        this.handleDirectoryAnalytics()
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
            gAnalytics.trackEvent('designerdirectory','view',{name : 'DesignerDirectoryPage'});
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

    _renderHeader(data) {
        return (
            <View
                style={{
                    height: 30,
                    justifyContent: "center",
                    backgroundColor: "#eee",
                    paddingLeft: 10
                }}
            >
                <Text>{data.sectionId}</Text>
            </View>
        );
    }

    handlePress(id) {
        this.props.navigation.navigate("DesignerProfile", { id: id });
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
                            ]}
                        />

                    </View>
                    <Text style={styles.name}>{data.designer_name}</Text>
                </TouchableOpacity>
            </View>


        );
    }

    _renderItem = ({ item }) => {
        return (
            <ListItem
                roundAvatar
                hideChevron={true}
                avatar={{ uri: item.profile_pic ? Config.BaseUrl + item.profile_pic : Config.NoImageUrl }}
                key={item.id}
                title={item.designer_name}
                onPress={() =>
                    this.props.navigation.navigate("DesignerProfile", {
                        id: item.id
                    })}
            />
        );
    };

    setQuery(q) {
        this.setState({ query: q });
        if (q.length > 1) {
            this.setState({searching:true})
          this.props.stores.designer
            .fetchDesigners(q)
            .then(success => {
                if(success.length > 0)
              this.setState({ searchdata: success,noresultsfound:false,searching:false }, () => {
                    gAnalytics.trackEvent('designerdirectory','search',{query : q});
              })
                else
                this.setState({noresultsfound:true,searching:false})   
            })
            .catch(error => {
              // console.log(error);
            });
        } else {
          this.setState({ searchdata: [] });
        }
    }

    clearQuery(){
        this.setState({query:'',noresultsfound:false})
        this.search.clearText();

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
                        onClearText={ () => this.clearQuery }
                        placeholder="Search Designers..."
                        clearIcon
                    />
                    {this.state.searching ? (
                        <Spinkit />
                    ) : ( this.state.noresultsfound ? <View>
                                    <Text
                                      style={{ marginTop: 15, textAlign: "center", fontWeight: "500" }}>
                                      {'No designers found'}
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
                    if(this.state.notfound){
                                return (
                                  <View>
                                    <Text
                                      style={{ marginTop: 15, textAlign: "center", fontWeight: "500" }}>
                                      {'No designers found. Come back later!'}
                                    </Text>
                                  </View>
                                )
                    }else{
                        const { designers } = this.state;
                        return (
                          
                         
                           
                            <AtoZList
                                sectionHeaderHeight={35}
                                cellHeight={218}
                                data={designers}
                                renderCell={this._renderCell}
                                renderSection={this._renderHeader}
                                style={{marginTop:0}}
                            />
                           
                           
                          
                        );
                    }
            } else{
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
