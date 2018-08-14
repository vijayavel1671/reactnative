import React, { Component } from "react";
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  Dimensions
} from "react-native";
import { SpinkitLarge,TabBarIcon } from "@components";
import { Style, Config,Images } from "@common";
import { inject, observer, observable } from "mobx-react";
import { Avatar } from "react-native-elements";
const APP_WIDTH = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

@inject("stores")
@observer
export default class UserProfileInfoScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userdata: this.props.userdata,
      profile_pic: this.props.profile_pic,
      email: this.props.userdata.user.email.toString().indexOf('facebook') >= 0 ? '<Unknown>' : this.props.userdata.user.email,
    };
  }

  render() {
    const { userdata } = this.state;
    return (
	
      <View style={[Style.designer_profile_container,{marginBottom:0}]}>
        <Avatar
          xlarge
          rounded
          source={{
            uri: this.state.profile_pic ?
              Config.BaseUrl + this.state.profile_pic
              : Config.NoImageUrl
          }}
          onPress={() => { }}
          containerStyle={{ "alignSelf": 'center', marginTop: 3 }}
          activeOpacity={0.9} />
        <Text style={Style.designer_profile_title}>Name</Text>
        <Text style={Style.designer_profile_body}>
          {userdata.user.first_name} {userdata.user.last_name}
        </Text>

        <Text style={Style.designer_profile_title}>Email</Text>
        <Text style={Style.designer_profile_body}>
          {this.state.email}
        </Text>

        {userdata.user_detail ? (
          <View>
            {
              (userdata.user_detail.address1) ?
                <View>
                  <Text style={Style.designer_profile_title}>I am from</Text>
                  <Text style={Style.designer_profile_body}>
                    {userdata.user_detail.address1}
                  </Text>
                </View> : null
            }
            {
              (userdata.user_detail.mobile)
                && userdata.user_detail.mobile !== 'undefined' ?
                <View>
                  <Text style={Style.designer_profile_title}>{'Mobile'}</Text>
                  <Text style={Style.designer_profile_body}>
                    {userdata.user_detail.mobile}
                  </Text>
                </View> : null
            }

            <View>
              <Text style={Style.designer_profile_title}>
                {'Subscribed to Newsletter ?'}
                      </Text>
              <Text style={Style.designer_profile_body}>
                {userdata.user_detail.is_newsletter_subscribed == 0
                  ? "No"
                  : "Yes"}
              </Text>
            </View>
            {(userdata.user_detail.company_name)
              && userdata.user_detail.company_name !== 'undefined' ?
              <View>
                <Text style={Style.designer_profile_title}>Company</Text>
                <Text style={Style.designer_profile_body}>

                  {userdata.user_detail.company_name}

                </Text>
              </View> : null}

          </View>
        ) : (
            <Text style={Style.designer_profile_title}>
              Add more information about yourself
                  </Text>
          )}
      </View>
	  
	  
    )
  }
}

/*  {(userdata.user_detail.company_name)
              && userdata.user_detail.company_name !== 'undefined' ?
              <View>
                <Text style={Style.designer_profile_title}>Company</Text>
                <Text style={Style.designer_profile_body}>

                  {userdata.user_detail.company_name}

                </Text>
              </View> : null} */