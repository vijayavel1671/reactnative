/* @flow */
import { AsyncStorage, Alert } from "react-native";
import { action, observable, computed } from "mobx";
import React, { Component } from "react";
import { Config } from "@common";

export default class HomeStore {
  @observable homedata = [];
  @observable homeSectiondata = [];
  @observable homeEvents = [];
  @observable homeNews = [];  
  @observable designerAdBigBanner =[];
  @observable designerAd = [];
  @observable tokenValue = null;

  @action("fetch home screen data")
  getHomeData() {
    /*http://realarticles.com/zingbi/admin/public/api/home*/
    //console.log("Homecoming.......");
    return fetch(Config.ApiUrl + "home/mobile")
      .then(res => res.json())
      .then(
        action("home_fetch_success", responseJson => {
          if (responseJson.status == "success") {
            this.homedata = responseJson.categories;
            this.homeSectiondata = responseJson.home_sections;
            this.homeEvents = responseJson.events;
            this.designerAdBigBanner = responseJson.designer_ad_big_banner;
            this.designerAd = responseJson.designer_ad;
	    this.homeNews = responseJson.news;
          }
          return this.homedata;
        })
      )
      .catch(err => {
        console.log(err);
      });
  }

}