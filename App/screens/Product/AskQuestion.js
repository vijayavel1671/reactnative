'use strict';
import React, {Component} from "react";
import {Text, View,TouchableOpacity, TextInput,ScrollView,Alert} from "react-native";
import css from "../Forms/style";
import { Languages,Style,Images} from "@common";
import {SpinkitLarge,TabBarIcon} from "@components";
import { inject, observer } from "mobx-react";

@inject("stores")
@observer
export default class AskQustionScreen extends Component{
	  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      question : '',
      token : '',
      store_id : 0,
      hideHome: false
    }
  }

static navigationOptions = {
    title: 'Ask Question',
    headerMode: 'float',
  }


  componentWillMount(){
    const { state,navigate,goBack } = this.props.navigation 
    let p = state.params
   
    this.props.stores.user.checkUserToken()
      .then(token => {
          if(!token){
                      Alert.alert( 'Ask Question', 
                      'You must be logged in to perform this action',
                        [ 
                        {text: 'Cancel', onPress: () => goBack(), style: 'cancel'},
                        {text: 'LOG IN', 
                        onPress: () => navigate('UserProfileScreen')
                      } ],
                { cancelable : false } )
          }else{
            this.setState({token:token,store_id:p.store_id})
          }
         
      })
      .catch(err => {console.log(err)})
  }


  btnSubmit(){
    const {navigate,goBack} = this.props.navigation;
          this.props.stores.user.checkUserToken()
      .then(token => {
          if(!token){
                      Alert.alert( 'Ask Question', 
                      'You must be logged in to perform this action',
                      [ 
                      {text: 'Cancel', onPress: () => goBack(), style: 'cancel'},
                      {text: 'LOG IN', 
                      onPress: () => navigate('UserProfileScreen')
                      }, ],
                { cancelable: false } )
          }else{
                this.setState({loading:true})
                let d = {
                  question : this.state.question.trim(),
                  token : this.state.token,
                  store_id : this.state.store_id,
                };
               if(!d.question.length){
                    Alert.alert('Question field is required')  
                    this.setState({loading:false})
               }else{
                this.props.stores.misc.submitQuestion(d)
                        .then(res => {
                          console.log(res);
                             if(res.status == "success"){
                                this.setState({question:'',title:'',loading:false});
                                Alert.alert( 'Ask Question', 
                                  res.message,
                                  [ 
                                  {text: 'OK', 
                                  onPress: () => goBack()
                                  },],
                                    { cancelable: false })
                                  }
                            else{
                                Alert.alert(res.messages[0])
                                this.setState({loading:false})
                              }
                        })
                        .catch(err => console.log(err ))
               } 
             }
          })
      .catch(err => {console.log(err)})  

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

  render(){
    if(this.state.loading){
        return(<SpinkitLarge/>)
    }else{
    	return(
    	<View style={Style.container}>
          <ScrollView style={css.wrap} keyboardShouldPersistTaps={'handled'} onMomentumScrollBegin={() => { this.setState({ hideHome: true }) }}
            onMomentumScrollEnd={() => { this.setState({ hideHome: false }) }}>
          <View style={css.body}>
            <View style={css.wrapForm}>

        {/*Question*/}
         <View style={css.textInputWrap}>
                <Text style={css.textLabel}>Question</Text>
                <TextInput underlineColorAndroid="transparent"
        					multiline = {true}
           				numberOfLines = {5}		
                 placeholder="Enter your question"
                 style={css.textInput_large}
                 value={this.state.question}
                 onChangeText={(text) => this.setState({question: text})}/>
              </View>         
    

            {/*Buttons*/}
              <View style={css.wrapButton}>
                <TouchableOpacity style={css.btnLogIn} onPress={this.btnSubmit.bind(this)}>
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
