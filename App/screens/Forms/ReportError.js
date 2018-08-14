"use strict";
import React, { Component } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert
} from "react-native";
import css from "./style";
import { Languages, Style, Config,Images } from "@common";
import { SpinkitLarge, TabBarIcon } from "@components";
import { inject, observer } from "mobx-react";

@inject("stores")
@observer
export default class ReportErrorScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      title: "",
      comment: "",
      token: "",
      store_id: 0,
      error_type: "",
      hideHome : false
    };      
  }

  static navigationOptions = {
    title: "Report Error",
    headerMode: "float"
  };

  componentWillMount() {
    const { state, navigate, goBack } = this.props.navigation;
    let p = state.params;

    this.props.stores.user
      .checkUserToken()
      .then(token => {
        if (!token) {
          Alert.alert(
            "Error Report",
            "You must be logged in to perform this action",
            [
              { text: "Cancel", onPress: () => goBack(), style: "cancel" },
              {
                text: "LOG IN",
                onPress: () => navigate("Initial")
              }
            ],
            { cancelable: false }
          );
        } else {
          this.setState({
            token: token,
            store_id: p.store_id,
            error_type: p.error_type
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  btnSignUp() {
    const { navigate, goBack } = this.props.navigation;
    this.props.stores.user
      .checkUserToken()
      .then(token => {
        if (!token) {
          Alert.alert(
            "Feedback",
            "You must be logged in to give Feedback",
            [
              { text: "Cancel", onPress: () => goBack(), style: "cancel" },
              {
                text: "LOG IN",
                onPress: () => navigate("Initial")
              }
            ],
            { cancelable: false }
          );
        } else {
          this.setState({ loading: true });
          let d = {
            comment: this.state.comment.trim(),
            token: this.state.token,
            store_id: this.state.store_id,
            error_type: this.state.error_type,
            title: this.state.title.trim()
          };
          if (!d.comment || !d.title) {
            Alert.alert("Missing one or more field.");
            this.setState({ loading: false });
          } else {
            this.props.stores.misc
              .submitErrorReport(d)
              .then(res => {
                if (res.status == "success") {
                Alert.alert(
                      res.message,
                      null,
                      [
                          {
                              text: "OK",
                              onPress: () => this.props.navigation.goBack() }
                      ],
                      { cancelable: false }
                  );
                  this.setState({ comment: "", title: "", loading: false });
                } else {
                  Alert.alert(res.message);
                  this.setState({ loading: false });
                }
              })
              .catch(err => console.log(err));
          }
        }
      })
      .catch(err => {
        console.log(err);
      });
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
    if (this.state.loading){
        return(<SpinkitLarge/>)
    }
    return (
      <View style={Style.container}>
        <ScrollView style={css.wrap} keyboardShouldPersistTaps={'handled'}>
          <View style={css.body}>
            <View style={css.wrapForm}>
              {/*Title*/}
              <View style={css.textInputWrap}>
                <Text style={css.textLabel}>Title</Text>
                <TextInput
                  placeholder="Title.."
                  underlineColorAndroid="transparent"
                  style={css.textInput}
                  value={this.state.title}
                  onChangeText={text => this.setState({ title: text })}
                />
              </View>

              {/*Comment*/}
              <View style={css.textInputWrap}>
                <Text style={css.textLabel}>Description</Text>
                <TextInput
                  underlineColorAndroid="transparent"
                  multiline={true}
                  numberOfLines={5}
                  placeholder="Enter your comment"
                  style={css.textInput_large}
                  value={this.state.comment}
                  onChangeText={text => this.setState({ comment: text })}
                />
              </View>

              {/*Buttons*/}
              <View style={css.wrapButton}>
                  <TouchableOpacity
                    style={css.btnLogIn}
                    onPress={this.btnSignUp.bind(this)}
                  >
                    <Text style={css.btnLogInText}> Submit </Text>
                  </TouchableOpacity>
                
              </View>
            </View>
          </View>
        </ScrollView>
        {/*
          !this.state.hideHome ?
            <View style={[Style.fixedFooter, { width: 50, height: 50, borderRadius: 100, right: '4%', bottom: '3%', flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }]}>
              <TouchableOpacity style={Style.iconFixFooter} onPress={() => this.props.navigation.navigate('Main')}>
                <TabBarIcon icon={Images.icons.news} tintColor={'#fff'} />
              </TouchableOpacity>
            </View> : null
        */}
		
		
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
		
		
      </View>
    );
  }
}