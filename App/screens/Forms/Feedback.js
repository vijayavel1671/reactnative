'use strict';
import React, {Component} from "react";
import {Text, View, TouchableOpacity, TextInput,ScrollView,Alert,Platform,ToastAndroid} from "react-native";
import css from "./style";
import { Languages,Style,gAnalytics, Images} from "@common";
import {SpinkitLarge,TabBarIcon} from "@components";
import { inject, observer } from "mobx-react";

@inject("stores")
@observer
export default class FeedbackScreen extends Component{
	  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      comment : '',
      token : null,
      submitText : 'Submit',
      storeid : null,
      userid : null
    }

    gAnalytics.trackScreenView('FeedbackPage')
    
  }

static navigationOptions = {
    title: 'Feedback',
  }

  componentWillMount(){
  const {navigate,goBack} = this.props.navigation;  
  let {storeid,token} = this.props.navigation.state.params;
  this.setState({storeid,token}, () => {
              if(!token){
                      Alert.alert( 'Feedback', 
                      'You must be logged in to give Feedback',
                        [ 
                        {text: 'Cancel', onPress: () => goBack(), style: 'cancel'},
                        {text: 'LOG IN', 
                        onPress: () => navigate('Initial')
                      }, ],
                { cancelable: false } )
          }
       this.handleAnalytics();   
    })
  }

  handleAnalytics(){
     this.props.stores.user.getuserInfoBasic()
          .then(data => {
              let d = JSON.parse(data)
              this.setState({userid:d.id})
              gAnalytics.setUser(d.id.toString());
          }).catch(err => console.log(err))

      gAnalytics.trackEvent('feedback','view',{name:'FeedbackPage'})    
  }

  btnSignUp(){
    const {navigate,goBack} = this.props.navigation;
    /*If user comes back from sign in screen*/
          if(!this.state.token){
                      Alert.alert( 'Feedback', 
                      'You must be logged in to give Feedback',
                      [ 
                      {text: 'Cancel', onPress: () => goBack(), style: 'cancel'},
                      {text: 'LOG IN', 
                      onPress: () => navigate('Initial')
                      }, ],
                { cancelable: false } )
          }else{
            let trimmedComment = this.state.comment.trim() 
           if(trimmedComment.length > 0){
            this.setState({loading:true})
              let d = {
                comment : this.state.comment,
                token : this.state.token
              };
              this.props.stores.misc.submitFeedback(d)
                      .then(res => {
                          if(res.status == "success"){
                            gAnalytics.trackEvent('feedback','submit',{userId:this.state.userid,storeId:this.state.storeid})
                              this.setState({comment:'',submitText:'Submit',loading:false})
                                    Alert.alert( 'Feedback', 
                                      res.message,
                                      [ 
                                      {text: 'Ok', onPress: () => goBack() },
                                      ],
                                { cancelable: false } )
                              }
                          else{
                              this.setState({loading:false})
                              Alert.alert(res.message)
                            }
                      })
                      .catch(err => console.log(err ))
                }else{
                    Platform.OS === "android" ? 
                      ToastAndroid.show("Comment field is missing", ToastAndroid.SHORT)
                      :  Alert.alert("Comment field is missing")

                }
          }
  }

  render(){
    if (this.state.loading){
        return(<SpinkitLarge/>)
    }
  	return(
  	<View style={Style.container}>
        <ScrollView style={css.wrap} keyboardShouldPersistTaps={'handled'} >
        <View style={css.body}>
          <View style={css.wrapForm}>

      {/*Comment*/}
        <View style={css.textInputWrap}>
              <Text style={css.textLabel}>Comment</Text>
              <TextInput underlineColorAndroid="transparent"
      					multiline = {true}
         				numberOfLines = {8}		
                returnKeyType={"done"}
               placeholder="Enter your comment"
               style={css.textInput_large}
               onChangeText={(text) => this.setState({comment: text})}/>
        </View>         
  

          {/*Buttons*/}
            <View style={css.wrapButton}>
               <TouchableOpacity style={css.btnLogIn}
                                    onPress={this.btnSignUp.bind(this)}>
                <Text style={css.btnLogInText}> {this.state.submitText} </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
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
	  
	  
	  
    </View>
  		);
  }
}
