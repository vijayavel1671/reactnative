'use strict';
import React, { Component } from "react";
import { Text, View, Image, TouchableOpacity, ScrollView, TextInput, Picker, Alert } from "react-native";
import css from "../Forms/style";
import { Languages, Style, Config, gAnalytics,Images } from "@common";
import { SpinkitLarge, TabBarIcon } from "@components";
import styles from "../../../styles";
import { inject, observer } from "mobx-react";
import moment from 'moment';
import DatePicker from 'react-native-datepicker';


@inject("stores")
@observer
export default class UpdateAppointmentsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      token: null,
      notfound: false,
      appointment: null,
      apid: 0,
      comment: '',
      date: '',
      old_date: '',
      current_status: null,
      cancel_box: false,
      cancel_reason: '',
      new_status: '',
      datetimedisabled: false,
    }
  }

  static navigationOptions = {
    title: 'Edit Appointment',
    headerMode: 'float',
  }


  componentWillMount() {
    let token = this.props.navigation.state.params.token
    let apid = this.props.navigation.state.params.id
    this.setState({ token, apid }, () => {
      // Get appointment details by id
      this.props.stores.user.getAppointmentById(this.state.apid)
        .then(res => {
          if (res.status == 'success') {
            this.setState({
              appointment: res.appointment,
              loading: false,
              notfound: false,
              comment: res.appointment.comment,
              date: res.appointment.date_requested,
              old_date: res.appointment.date_requested,
              current_status: res.appointment.status
            })
          } else {
            this.setState({ loading: false, notfound: true })
          }
        })
    })
  }

  upDateCStatus = current_status => {
    if (current_status == 'cancelled') {
      this.setState({ new_status: current_status, cancel_box: true, datetimedisabled: true });
    } else {
      this.setState({ new_status: current_status, cancel_box: false, datetimedisabled: false });
    }
    /*Change list of states....*/
  };

  btnUpdateAppointment() {
    let data = {
      token: this.state.token,
      comment: this.state.comment,
      date_requested: this.state.date,
      status: this.state.new_status,
      appointment_id: this.state.apid,
      cancel_reason: this.state.cancel_reason
    }

    if (data.comment !== '' && data.date_requested !== '' && data.status !== '') {
      if (data.status == 'cancelled' && data.cancel_reason == '') {
        Alert.alert("Cancellation reason required")
      } else if (data.status == 'rescheduled' && data.date_requested == this.state.old_date) {
        Alert.alert("Date or time is not modified.")
      } else if (data.status == 'rescheduled' && moment(data.date_requested).diff(moment(new Date()), 'minutes') <= 1440) {
        Alert.alert("Appointment can be rescheduled only after 24 hours.")
      }else {
        this.setState({ loading: true })
        this.props.stores.user.updateAppointment(data)
          .then(res => {
            this.setState({ loading: false })
            if (res.status == 'success') {
              Alert.alert(
                res.message,
                null,
                [{
                  text: "OK",
                  onPress: () => this.props.navigation.goBack()
                }],
                { cancelable: false });
            } else {
              Alert.alert(
                res.message[0],
                null,
                [{
                  text: "OK",
                  onPress: () => this.props.navigation.goBack()
                }],
                { cancelable: false });
            }
          }).catch(e => console.log(e))
      }
    } else {
      Alert.alert('One or more fields missing')
    }
  }

  render() {
    const startDate = new Date()
    if (this.state.loading) {
      return (<SpinkitLarge />)
    } else {
      if (!this.state.notfound) {
        return (
		
		<View style={Style.container}>
          <ScrollView style={css.wrap}>
            <View style={css.body}>
              <View style={css.wrapForm}>
                <Text>Store : {this.state.appointment.store_name}</Text>
                <View style={[css.textInputWrap]}>
                  <Text style={css.textLabel}>
                    Appointment status
                      </Text>
                  <Picker
                    itemStyle={{ height: 88 }}
                    pickerStyleType={{ height: 50, backgroundColor: '#000000' }}
                    selectedValue={this.state.new_status}
                    onValueChange={this.upDateCStatus}>
                    <Picker.Item label="Change Appointment Status" value="" />
                    <Picker.Item key={1}
                      label={'Reschedule'}
                      value={'rescheduled'} />
                    <Picker.Item key={1}
                      label={'Cancel'}
                      value={'cancelled'} />
                  </Picker>
                </View>

                {/*Date*/}
                <View style={css.textInputWrap}>
                  <TouchableOpacity onPress={this._showDateTimePicker}>
                    <Text style={css.textLabel}>Appointment Date and Time</Text>
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
                    disabled={this.state.datetimedisabled}
                    onDateChange={(date) => { this.setState({ date: date }) }}
                  />
                </View>

                {
                  this.state.cancel_box ? (<View style={css.textInputWrap}>
                    <Text style={css.textLabel}>Cancellation reason</Text>
                    <TextInput style={css.textInput_large} underlineColorAndroid="transparent"
                      value={this.state.cancel_reason}
                      multiline={true}
                      numberOfLines={8}
                      placeholder="Enter your reason for cancellation"
                      onChangeText={(text) => this.setState({ cancel_reason: text })} />
                  </View>) : null
                }

                {/*Comment*/}
                <View style={css.textInputWrap}>
                  <Text style={css.textLabel}>Comment</Text>
                  <TextInput style={css.textInput_large} underlineColorAndroid="transparent"
                    value={this.state.comment}
                    multiline={true}
                    numberOfLines={8}
                    placeholder="Enter your comment"
                    onChangeText={(text) => this.setState({ comment: text })} />
                </View>

                {/*Buttons*/}
                <View style={css.wrapButton}>
                  <TouchableOpacity
                    style={css.btnLogIn}
                    onPress={this.btnUpdateAppointment.bind(this)}>
                    <Text style={css.btnLogInText}> {'Update'} </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

          </ScrollView>
		  
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
        )
      } else {
        return (
          <View style={Style.container}>
            <Text style={{ textAlign: 'center', fontSize: 22, marginTop: '35%' }}>Appointment not found.</Text>
			
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
        )
      }
    }
  }
}
