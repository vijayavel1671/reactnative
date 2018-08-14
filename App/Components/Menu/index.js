import React, { Component } from "react";
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  ScrollView,
  AsyncStorage,
  Easing,
  Alert
} from "react-native";
import styles from "../../../styles";
import Icon from "react-native-vector-icons/FontAwesome";
import Collapsible from 'react-native-collapsible';
import { inject, observer, observable } from "mobx-react";

@inject("stores")
@observer
export default class Index extends Component {

  constructor(props){
      super(props);
      this.state = {
          token : null,
          collapsed : true,
      }
  }

  componentWillMount(){
        AsyncStorage.getItem("usertoken")
      .then(token => {
        if (token) {
          this.setState({ token });
        }else{
          this.setState({collapsed : false})
        }
      })
      .catch(err => console.log(err));
  }

  _handleNavigationChild(url,params){
        this.props.handleNavigationMain(url,params);
  }


  _toggleExpanded(){
      this.setState({ collapsed: !this.state.collapsed });
  }

  handleAccord(status,title,navigation_target){
    if(status){
      this._handleNavigationChild(navigation_target, { token: this.state.token, storeid: 0 })
    }else{
      this.props.handleAlertParent(title);
    }
  }

  render(){
    const userpresent = this.props.stores.user.isUserPresent;

    return (
       <View style={styles.drawerContent}>
          <View style={styles.menuBg}>
            <ScrollView
              contentContainerStyle={[styles.menu_inner, { width: 270}]}>
              
              <TouchableOpacity
                key={4}
                onPress={() => {
                  this._handleNavigationChild("UserProfileScreen", {
                    from: "favscreen"
                  });
                }}>
                <Text style={styles.menuItem}>{"My account"}</Text>
              </TouchableOpacity>
              
              {userpresent ? (
                <TouchableOpacity
                  key={5}
                  onPress={() => {
                    this._handleNavigationChild("RecentlyViewed", {
                      token: this.state.token
                    });
                  }}>
                  <Text style={styles.menuItem}>{"Recently viewed"}</Text>
                </TouchableOpacity>
              ) : null}
              
              {userpresent ? (
                <TouchableOpacity
                  key={14}
                  onPress={() => {
                    this._handleNavigationChild("MyBlogs", {token : this.state.token});
                  }}>
                  <Text style={styles.menuItem}>{"My blogs"}</Text>
                </TouchableOpacity>
                  )
               : null}
              {userpresent ? (
                <TouchableOpacity
                  key={8}
                  onPress={() => {
                    this.handleAccord(userpresent, 'Appointments', 'Appointments')
                  }}>
                  <Text style={styles.menuItem}>{"Appointments"}</Text>
                </TouchableOpacity>
              ) : null}

              <TouchableOpacity
                key={2}
                onPress={() => {
                  this._handleNavigationChild("OurStores", {});
                }}>
                <Text style={styles.menuItem}>{"Our stores"}</Text>
              </TouchableOpacity>
            {/*-----------------------------More--------------------------------*/}
               {userpresent ? <TouchableOpacity
                                 key={3}
                                 onPress={this._toggleExpanded.bind(this)}>
                                 <Text style={styles.menuItem}>{"More"}</Text>
                               </TouchableOpacity> : null}
                 <Collapsible collapsed={userpresent ? this.state.collapsed : false} align={'top'} >
                    <View style={[{ marginLeft : userpresent ? 20 : 0 } ]}>
                          
                          <TouchableOpacity
                              key={13}
                              onPress={() => {
                                this._handleNavigationChild("Vtour", {});
                              }}>
                              <Text style={styles.menuItem}>{"Virtual tour"}</Text>
                          </TouchableOpacity>
                            
                          <TouchableOpacity
                              key={1}
                              onPress={() => {
                                this._handleNavigationChild("AboutUs", {});
                              }}> 
                              <Text style={styles.menuItem}>{"About us"}</Text>
                          </TouchableOpacity>                          

                          <TouchableOpacity
                                key={'settings'}
                                onPress={() => {
                                  this._handleNavigationChild("Settings", { token: userpresent ? this.state.token : null});
                                }}> 
                                <Text style={styles.menuItem}>{"Settings"}</Text>
                        </TouchableOpacity>
                       <TouchableOpacity
                                key={'feedback'}
                                onPress={() => { this.handleAccord(userpresent,'Feedback','Feedback')}}> 
                                <Text style={styles.menuItem}>{"Feedback"}</Text>
                        </TouchableOpacity> 
                        <TouchableOpacity
                          key={'rateus'}
                          onPress={() => {
                            this._handleNavigationChild('rateus',{});
                          }}>
                          <Text style={styles.menuItem}>{"Rate us"}</Text>
                        </TouchableOpacity> 

                        <TouchableOpacity
                          key={'faqs'}
                          onPress={() => {
                            this._handleNavigationChild("Faqs", {});
                          }}>
                          <Text style={styles.menuItem}>{"FAQs"}</Text>
                        </TouchableOpacity> 

                  </View>
              </Collapsible>
            </ScrollView>
          </View>
        </View>
    )
  }
}
