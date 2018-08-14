import React,{Component} from "react";
import {
    View,
    Text,
    Button,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
    ScrollView,
    Image,
    Easing,
    FlatList,
    AsyncStorage
  } from "react-native";
import { inject, observer } from "mobx-react";
import { TabBarIcon, SpinkitLarge } from "@components";
import {  Config } from "@common";

@inject("stores")
@observer
export default class EventScreen extends Component{

    static navtigationOptions = {
        title: "Events",
        headetMode: "screen"
    };

    constructor(props,context){
        super(props,context);

        this.state={
            events:[],
            noevents: false
        }
    };

    render() {
        if (this.state.animating) {
          return <SpinkitLarge />;
        } else {
          if (this.state.noevents) {
            return (
              <View>
                <Text
                  style={{ marginTop: 15, textAlign: "center", fontWeight: "500" }}>
                  {'No events. Come back later!'}
                </Text>
              </View>
            );
          } else {
            return (
              <View style={styles.container}>
                <FlatList
                  data={[
                    {key: 'Devin'},
                    {key: 'Jackson'},
                    {key: 'James'},
                    {key: 'Joel'},
                    {key: 'John'},
                    {key: 'Jillian'},
                    {key: 'Jimmy'},
                    {key: 'Julie'},
                  ]}
                  ItemSeparatorComponent={this.space}
                  horizontal={true}
                  renderItem={({item}) => <View style={{backgroundColor: 'white',height:100,width:300,flex: 1, flexDirection: 'row'}}>
                                            <View style={{width: 150, height: 100, backgroundColor: 'powderblue'}} >
                                            <Text style={styles.item}>{item.key}</Text></View>
                                            <Image                                              
                                              source={{
                                                uri: Config.NoImageUrl
                                              }}
                                            />
                                        </View>}
                />
              </View>
            );
          }

        }
    }

    

    space(){
      return(<View style={{height: 50, width: 2, backgroundColor: 'black'}}/>)
    }

}

const styles = StyleSheet.create({
  container: {
   flex: 1,
   paddingTop: 22
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
})