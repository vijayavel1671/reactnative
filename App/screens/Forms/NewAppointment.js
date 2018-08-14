'use strict';
import React, { Component } from "react";
import { Text, View, Image, TouchableOpacity, TextInput, ScrollView, Switch, Picker, Alert, ToastAndroid, Platform } from "react-native";
import css from "./style";
import { Languages, Style, Config, gAnalytics,Images } from "@common";
import { SpinkitLarge,TabBarIcon } from "@components";
import DatePicker from 'react-native-datepicker';
import { inject, observer } from "mobx-react";
import moment from 'moment';

@inject("stores")
@observer
export default class NewAppointmentScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      comment: '',
      isDateTimePickerVisible: false,
      storeid: 0,
      date: '',
      token: '',
      userid: null,
      open_time : null,
      close_time : null
    }
    gAnalytics.trackScreenView('NewAppoinmentPage')
  }


  _showDateTimePicker = () => this.datepicker.onPressDate();

  componentWillMount() {
    let paramId = this.props.navigation.state.params.id;
    let paramToken = this.props.navigation.state.params.token;
    let { open_time, close_time } = this.props.navigation.state.params

    if (paramId !== 0) {
      this.setState({ storeid: paramId, token: paramToken,open_time:open_time,close_time:close_time },
        () => {
          this.handleAnalytics();
        });
    }
  }

  handleAnalytics() {
    this.props.stores.user
      .getuserInfoBasic()
      .then(data => {
        let d = JSON.parse(data);
        this.setState({ userid: d.id });
        gAnalytics.setUser(d.id.toString());
      })
      .catch(err => console.log(err));
    gAnalytics.trackEvent('appointment', 'view', { name: 'NewAppoinmentPage' })
  }

  static navigationOptions = {
    title: 'New Appointment',
    headerMode: 'float',
  }
/* TTob be kjdflaskj */
  btnSetAppointment(){
     let trimmedComment = this.state.comment.trim()
     
     let initTime = moment(this.state.open_time,'HH:mm A')
     let endTime = moment(this.state.close_time,'HH:mm A')
     let dt = moment(this.state.date).format("HH:mm A");
   
    if (this.state.date !== "" && trimmedComment.length > 0) {
      if (moment(this.state.date).diff(moment(), 'minutes') < 0) {
        Alert.alert("Invalid date or time selected")
      } else if (moment(this.state.date).diff(moment(new Date()), 'minutes') <= 1440){
          Alert.alert("Appointment can't be scheduled within 24 hours.")
      } else if (!moment(dt, 'HH:mm A').isBetween(initTime,endTime)){
         Alert.alert("Appointment can't be scheduled before or after working hours.")
      }else{
        this.setState({ loading: true })
        let d = {
          token: this.state.token,
          store_id: this.state.storeid,
          comment: this.state.comment,
          date_requested: this.state.date,
          status: 'pending'
        }
        this.props.stores.user.bookAppointment(d)
          .then(res => {
            if (res.status == "success") {
              this.setState({ loading: false, comment: '', date_requested: '' }, () => {
                gAnalytics.trackEvent('appointment', 'submit', { userId: this.state.userid, storeId: d.store_id })
              })
              Alert.alert(
                res.message,
                null,
                [{ text: "OK", onPress: () => this.props.navigation.goBack() }],
                { cancelable: false }
              );
            }
            else {
              this.setState({ loading: false, comment: d.comment, date: d.date })
              if (Platform.OS === "android") {
                ToastAndroid.show(res.message[0], ToastAndroid.SHORT);
              } else {
                Alert.alert(res.message[0]);
              }
            }
          })
          .catch(err => console.log(err))
      }
    }
    else {
      Alert.alert("One or more field is missing.")
      this.setState({ loading: false })
    }
  }

  render() {
    const startDate = new Date()
    if (this.state.loading) {
      return (<SpinkitLarge />)
    }
    return (
      <View style={Style.container}>
        <ScrollView style={css.wrap}>
          <View style={css.body}>
            <View style={css.wrapForm}>
              {/*Date*/}
              <View style={css.textInputWrap}>
                <TouchableOpacity onPress={this._showDateTimePicker}>
                  <Text style={css.textLabel}>Select Date and Time</Text>
                </TouchableOpacity>
                <DatePicker
                  ref={(d) => { this.datepicker = d }}
                  style={{ width: '100%' }}
                  date={this.state.date}
                  mode="datetime"
                  placeholder="select date and time"
                  showIcon={true}
                  minDate={startDate}
                  format="YYYY-MM-DD HH:mm:ss"
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  customStyles={{
                    dateIcon: {
                      position: 'absolute',
                      left: 0,
                      top: 4,
                      marginLeft: 0
                    },
                    dateInput: {
                      "paddingTop": 5,
                      "paddingRight": 12,
                      "paddingBottom": 0,
                      "paddingLeft": 12,
                      "marginTop": 5,
                      "marginRight": 0,
                      "marginBottom": 10,
                      "marginLeft": 0,
                      "borderBottomColor": "rgba(229,229,229,1)",
                      "borderTopColor": "rgba(229,229,229,1)",
                      "backgroundColor": "rgba(255, 255, 255, 0.8)",
                      "height": 40,
                      "borderRadius": 2,
                      "borderWidth": 1,
                      "borderColor": '#ddd',
                    }
                    // ... You can check the source to find the other keys.
                  }}
                  onDateChange={(date) => { this.setState({ date }) }}
                />
              </View>
              {/*Comment*/}
              <View style={css.textInputWrap}>
                <Text style={css.textLabel}>Comment</Text>
                <TextInput style={css.textInput_large} underlineColorAndroid="transparent"
                  multiline={true}
                  numberOfLines={7}
                  placeholder="Enter your comment"
                  onChangeText={(text) => this.setState({ comment: text })} />
              </View>
              {/*Buttons*/}
              <View style={css.wrapButton}>
                <TouchableOpacity
                  style={css.btnLogIn}
                  onPress={this.btnSetAppointment.bind(this)}>
                  <Text style={css.btnLogInText}> Submit </Text>
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
