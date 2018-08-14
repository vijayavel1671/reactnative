/* @flow */
import { AsyncStorage, Alert } from "react-native";
import { action, observable, computed } from "mobx";
import React, { Component } from "react";
import { Config } from "@common";
import moment from 'moment';

export default class UserStore {
  @observable data = [];
  @observable userToken = null;
  @observable iniStateForUser = "SignInScreen";
  @observable LoginStatus;
  @observable isLoading = false;
  @observable bookmarksdata = [];
  @observable TokenData = null;
  @observable userdata = [];
  @observable isUserPresent = false;
  @observable bmload = true;
  @observable appointments = [];

  @action
  verifylogin(e, p) {
    this.isLoading = true;
    return fetch(Config.ApiUrl + "login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email : e,
        password: p
      })
    })
      .then(res => res.json())
      .then(
        action("login_api_success", result => {
          if (result.status == "success") {
            this.LoginStatus = true;
          } else {
            this.LoginStatus = false;
          }

          return result;
        })
      )
      .catch(error => {
        console.log(error);
      });
  }

  @action("Check user")
  checkUserToken() {
    return AsyncStorage.getItem("usertoken")
      .then(item => {
        if (item) {
          this.TokenData = item;
        } else {
          this.TokenData = null;
        }
        return this.TokenData;
      })
      .catch(error => {
        return (this.LoginStatus = false);
      });
  }

  @action("update user presence")
  updateUserPresence(status){
          if(status){
              this.isUserPresent = true;
          }
          else{
            this.isUserPresent = false;
          }
      return this.isUserPresent;    
  }

  @action("get basic user info")
  setuserInfo(token){
    return fetch(Config.ApiUrl + "userdetails", {
              method: "GET",
              headers: {
                "Authorization": "Bearer " + token
              }
            })
              .then(res => res.json())
              .then(
                action("fetch_user_details_success", responseJson => {
                        if(responseJson.status == 'success'){
                            AsyncStorage.setItem('userinfo',JSON.stringify(responseJson.user))
                                .then(success => {
                                    return true
                                })
                                .catch(e => console.log(e))
                        }
                  })
              )
              .catch(err => console.log(err));
  }

  @action('get basic user info')
  getuserInfoBasic(){
    return AsyncStorage.getItem('userinfo')
          .then(item => {
              return item
          }).catch(e => console.log(e));
  }

  @action
  registerUser(d) {
      this.isLoading = true;
      return fetch(Config.ApiUrl + "register", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: d.email,
          first_name: d.fname,
          last_name: d.lname,
          email: d.email,
          cnf_password: d.cnf_password,
          password: d.password,
          user_type: "user",
          facebook_id: "null",
          google_id: "null",
          status: "active"
        })
      })
        .then(res => res.json())
        .then(
          action("registeration_success", responseJson => {
            if (responseJson.status == "success") {
              this.LoginStatus = true;
            }
            return responseJson;
          })
        )
        .catch(error => {
          console.log(error);
        });
    
  }

  @action("get user details")
  getUserdetails(token) {
    /*get token*/    
        return fetch(Config.ApiUrl + "userdetails", {
                method: "GET",
                headers: {
                  "Authorization": "Bearer " + token
                }
              })
                .then(res => res.json())
                .then(
                  action("fetch_user_details_success", responseJson => {
                        this.userdata = responseJson;
                        this.isUserPresent = true;
                        return responseJson;
                  })
                )
                .catch(err => console.log(err));
  }

 @action("handle forgot password")
 forgotPassword(email_id){
      return fetch(Config.ApiUrl + "forgot-password", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email_id
        })
      })
        .then(res => res.json())
        .then(
          action("forgot_password_success", responseJson => {
           
            return responseJson;
          })
        )
        .catch(error => {
          console.log(error);
        });
   } 

 @action("forgot password berify OTP")
 verifyOTP(email_id,otp){
 return fetch(Config.ApiUrl + "check-otp", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email_id,
          otp : otp
        })
      })
        .then(res => res.json())
        .then(
          action("forgot_password_verify_otp_success", responseJson => {
           
            return responseJson;
          })
        )
        .catch(error => {
          console.log(error);
        });    
 }

 @action("facebook login")
 LoginFacebook(id,token){
  // console.log(id)
  // console.log(token)
  // console.log(Config.ApiUrl + "facebook-login")
     return fetch(Config.ApiUrl + "facebook-login", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          facebook_id : id,
          access_token : token
        })
      })
        .then(res => res.json())
        .then(
          action("facebook_login_api", responseJson => {
            return responseJson;
          })
        )
        .catch(error => {
          console.log(error);
        });  
 }

  @action("google login")
 LoginGoogle(token){
     return fetch(Config.ApiUrl + "google-login", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          access_token : token
        })
      })
        .then(res => res.json())
        .then(
          action("google_login_api", responseJson => {
                return responseJson;
          })
        )
        .catch(error => {
          console.log(error);
        });  
 }



 @action("set a new password after forgot")
setNewPassAfterForgot(otp,email,new_password){

 return fetch(Config.ApiUrl + "set-forgot-password", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          otp : otp,
          email: email,
          password : new_password
        })
      })
        .then(res => res.json())
        .then(
          action("forgot_password_changed_success", responseJson => {
          console.log(responseJson)
            return responseJson;
          })
        )
        .catch(error => {
          console.log(error);
        });    
 }

 @action("set new password normal")
 setNewPass(old,new_pass,token){
      return fetch(Config.ApiUrl + "changepassword", {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token                
              },
              body: JSON.stringify({
                current_password: old,
                password : new_pass
              })
            })
              .then(res => res.json())
              .then(
                action("password_changed_success", responseJson => {
                
                  return responseJson;
                })
              )
              .catch(error => {
                console.log(error);
              });          
 }


 @action("get my bookmarks")
 getMyBookmarks(token){
            return fetch(Config.ApiUrl + "mybookmarks", {
                method: "GET",
                headers: {
                  "Authorization": "Bearer " + token
                  }
                })
                .then(res => res.json())
                .then(
                  action("fetch_user_bookmarks_success", responseJson => {
                    
                      if(responseJson.status == "success"){
                        let arr = [];
                        responseJson.bookmarks.map( item => {
                            if(item.data.length > 0)
                            arr.push({key : item.key, data : item.data , title : item.key })
                            arr.slice()
                        });
                        this.bookmarksdata = arr;
                        this.LoginStatus = true;
                      }
                      else{
                       this.bookmarksdata = []; 
                      }

                     return responseJson; 
                  })
                )
                .catch(err => console.log(err));
         }

@action("book an appointment")
 bookAppointment(data){
  //  console.log(data.date_requested)
  //  console.log(Config.ApiUrl + "setappointment")
     return fetch(Config.ApiUrl + "setappointment", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Authorization": "Bearer " + data.token
        },
        body: JSON.stringify({
          store_id : data.store_id,
          comment : data.comment,
          date_requested : data.date_requested,
          status : data.status
        })
      })
        .then(res => res.json())
        .then(
          action("set_appointment_success", responseJson => {
          // console.log("<<<<<<<<<respone>>>>>>>>>>>")
          // console.log(responseJson)
            return responseJson;

          })
        )
        .catch(error => {
          console.log(error);
        });  
 }


@action("get appointment by id")
    getAppointmentById(id){
     return fetch(Config.ApiUrl + "appointment/"+id)
        .then(res => res.json())
        .then(
          action("fetch_user_appointment_success", responseJson => {
             return responseJson; 
          })
        )
        .catch(err => console.log(err));
    }

 @action("Update appointment")
 updateAppointment(data){
        return fetch(Config.ApiUrl + "update-appointment", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",          
          "Authorization": "Bearer " + data.token
        },
        body: JSON.stringify({
          appointment_id: data.appointment_id,
          date_requested : data.date_requested,
          comment: data.comment,
          status: data.status,
          cancellation_reason: data.cancel_reason
        })
      })
        .then(res => res.json())
        .then(
          action("update_appointment_success", responseJson => {
            return responseJson;
          })
        )
        .catch(error => {
          console.log(error);
        });
 }   


 @action("get appointments list")
 getMyAppointments(token){
       return fetch(Config.ApiUrl + "myappointments", {
                method: "GET",
                headers: {
                  "Authorization": "Bearer " + token
                  }
                })
                .then(res => res.json())
                .then(
                  action("fetch_user_bookmarks_success", responseJson => {
                      if(responseJson.status == 'success'){
                        this.appointments = responseJson.appointments
                      }else{
                        this.appointments = []
                      }
                     return responseJson; 
                  })
                )
                .catch(err => console.log(err));
 }

 @action("get my blogs list")
 getMyBlogs(token){
       return fetch(Config.ApiUrl + "myblogs", {
                method: "GET",
                headers: {
                  "Authorization": "Bearer " + token
                  }
                })
                .then(res => res.json())
                .then(
                  action("fetch_user_bookmarks_success", responseJson => {
                     return responseJson; 
                  })
                )
                .catch(err => console.log(err));
 }



 @action("update profile")
 updateUser(data){
  // console.log(data)
  // console.log(Config.ApiUrl + "updateuser")
    const formdata = new FormData(); 
      if(data.profile_pic){
      var fileName = data.profile_pic.substring(data.profile_pic.lastIndexOf("/") + 1);
        formdata.append('profile_pic', {
            uri: data.profile_pic,
            type: 'image/jpeg', // or photo.type
            name: fileName
        });
      }
          formdata.append('first_name', data.first_name)
          formdata.append('last_name', data.last_name)
          formdata.append('address1', data.address1)
          formdata.append('address2', data.address2)
          formdata.append('city_id', data.city)
          formdata.append('company_name', data.company_name)
          formdata.append('country_id', data.country)
          formdata.append('is_newsletter_subscribed', data.is_newsletter_subscribed)
          formdata.append('mobile', data.mobile)
          formdata.append('state_id', data.state)
          formdata.append('telephone_no', data.telephone_no)
          formdata.append('zipcode', data.zipcode)

        return fetch(Config.ApiUrl + "updateuser", {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Authorization": "Bearer " + data.token
                },
                body: formdata
              })
                .then(res => res.json())
                .then(
                  action("set_appointment_success", responseJson => {
                    return responseJson;
                  })
                )
                .catch(error => {
                  console.log(error);
                });
           
 }    

 @action("handle logout")
 handleLogout(){
  let status = false;
  return  AsyncStorage.removeItem("usertoken")
        .then(() => {
          return  AsyncStorage.removeItem("usertype")
                .then( () => {
                  AsyncStorage.removeItem("userinfo")
                  status = true;
                  return status;
                })
                .catch(err => console.log(err))
        })
        .catch(error => {
          console.log(error);
        });
 }

 @action("upload user gallery image")
 uploadusergall(data){
        var formdata = new FormData();
    if(data.image){
        var fileName = data.image.substring(data.image.lastIndexOf("/") + 1);
          formdata.append('image', {
              uri: data.image,
              type: 'image/jpeg', // or photo.type
              name: fileName
          });
        }
      formdata.append('store_id', data.store_id)
    
      return fetch(Config.ApiUrl + "store/usergallery", {
                  method: "POST",
                  headers: {
                    "Authorization": "Bearer " + data.token
                  },
                  body: formdata
                })
                  .then(res => res.json())
                  .then(
                    action("user_gallery_post_success", responseJson => {
                      return responseJson;
                    })
                  )
                  .catch(error => {
                    console.log(error);
                  });

   }      

}