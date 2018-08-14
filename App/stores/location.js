/* @flow */
import { AsyncStorage, Alert } from "react-native";
import { action, observable, computed } from "mobx";
import React, { Component } from "react";
import { Config } from "@common";

export default class LocationStore {
  /*default */
  @observable locationname = '';
  @observable locadata = [];

  @action("automatic location detection api")
  getLocationData(lat, long,manual_name = 'none') {
    this.isLoading = true;

    var geocodingAPIurl =
      "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
      lat +"," +long +"&key=AIzaSyAQRGhvUNAyBHth3VXOEQeTw35nmaEu1WI&sensor=true";

    return fetch(geocodingAPIurl)
      .then(res => res.json())
      .then(
        action("maps_api_success", result => {
          let arrAddress = result.results[0].address_components;

          let locationdata = {};

          for (var i = 0; i < arrAddress.length; i++) {
            if (arrAddress[i].types[0] == "locality") {
              locationdata["locality"] = arrAddress[i].long_name;
            }

            if (
              arrAddress[i].types[1] == "sublocality" &&
              arrAddress[i].types[2] == "sublocality_level_1"
            ) {
                //Checking if got any manual name
                if(manual_name !== "none"){
                    locationdata["sublocality_level_1"] = manual_name;
                }
                else{
                  locationdata["sublocality_level_1"] = arrAddress[i].long_name;    
                }
              
            }

            if (
              arrAddress[i].types[1] == "sublocality" &&
              arrAddress[i].types[2] == "sublocality_level_2"
            ) {
              locationdata["sublocality_level_2"] = arrAddress[i].long_name;
            }
          }

          locationdata["latitude"] = lat;
          locationdata["longitude"] = long;

          /*Save data locally*/
          // if(locationdata['sublocality_level_1']){
          //     this.locationname = locationdata['sublocality_level_1']
          //   }
          //   else if(locationdata['sublocality_level_2']){
          //     this.locationname = locationdata['sublocality_level_2']
          //   }else{
          //     this.locationname = locationdata['locality']
          //   }

          return JSON.stringify(locationdata);
        })
      )
      .catch(error => {
        console.log(error);
      });
  }

  @action('set location')
  setLocation(){
      AsyncStorage.getItem('locationdata')
            .then( success => {
              if(success){
                  if(success.sublocality_level_1){
                    this.locationname = success.sublocality_level_1
                  }
                  else if(success.sublocality_level_2){
                    this.locationname = success.sublocality_level_2
                  }else{
                    this.locationname = success.locality
                  }
              }
            })
            .catch(err => {
                console.log(err)
            })
  }

  @action("change location name and data")
  checkCurrentLocation() {
        return AsyncStorage.getItem('locationdata')
                .then( success => {
                  if(success){
                      if(success.sublocality_level_1){
                        this.locationname = success.sublocality_level_1
                      }
                      else if(success.sublocality_level_2){
                        this.locationname = success.sublocality_level_2
                      }else{
                        this.locationname = success.locality
                      }
                    return success;
                  }else{
                    return null
                  }
                })
                .catch(err => {
                    console.log(err)
                })

  }


  @action("location selection manual")
    getLocationByName(name){
      let demoUrl = "https://maps.googleapis.com/maps/api/geocode/json?address="+name+"&sensor=false&key=AIzaSyAQRGhvUNAyBHth3VXOEQeTw35nmaEu1WI"
        return fetch(demoUrl)
                .then(res => res.json())
                .then(action("fetch_location_data_success", responseJson => {

                   // console.log(responseJson);
                        let result = responseJson.results[0]; 

                           var lt = result.geometry.location.lat;
                           var ln = result.geometry.location.lng;
                           var manual_name = name;
                           
                          return this.getLocationData(lt,ln,manual_name)
                  })  
                )
                .catch(error => console.log(error))
    } 
}