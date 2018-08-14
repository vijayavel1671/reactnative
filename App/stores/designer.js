import { AsyncStorage, Alert } from "react-native";
import { action, observable, computed } from "mobx";
import React, { Component } from "react";
import { Config } from "@common";

export default class DesignerStore {
		@observable designerData = [];

	@action("GET DESIGNER DATA")
	getDesigner(did,token){
			return fetch(Config.ApiUrl + "designer/" + did,{
							method: "GET",
					        headers: {
					          Accept: "application/json",
					          "Content-Type": "application/json",
					          Authorization: "Bearer " + token
					        }
					})
					.then(res => res.json())
					.then(action("fetch_designer_success", responseJson => {
								if(responseJson.status == "success"){
										this.designerData = responseJson;
								}
								else{
									this.designerData = [];
								}

							return this.designerData;	

					}))
					.catch( error => {
							console.log(error)
					})
	}

	@action("bookmark or add to favorite a designer")
	bookmarkDesigner(id,token,bmaction){
      return fetch(Config.ApiUrl + "bookmark", {
		        method: "POST",
		        headers: {
		          Accept: "application/json",
		          "Content-Type": "application/json",
		          Authorization: "Bearer " + token
		        },
		        body: JSON.stringify({
		          action: bmaction,
		          reference_id : id,
		          reference_type : 'designer'
		        })
		      })
		        .then(res => res.json())
		        .then(
		          action("designer_bookamark_api_success", responseJson => {
		            console.log(responseJson);

		            return responseJson;
		          })
		        )
		        .catch(error => {
		          console.log(error);
		        });
	}

 @action("get designer collection gallery")
 getDesignerGallery(cid){
 				return fetch(Config.ApiUrl + "designer/collection/" + cid,{
							method: "GET",
					        headers: {
					          Accept: "application/json",
					          "Content-Type": "application/json"
					        }
					})
				.then(res => res.json())
				.then(action("fetch_designer_collection_gallery_success", responseJson => {
						return responseJson;	
				}))
				.catch( error => {
						console.log(error)
		    })
 	}			

@action("search designers")
  fetchDesigners(q){
    return fetch(Config.ApiUrl + "designer/search?search=" + q)
      .then(res => res.json())
      .then(
        action("fetch_designer_by_q_success", responseJson => {
          if (responseJson.status == "success") {
            this.pdata = responseJson.designers;
          } else {
            this.pdata = [];
          }
          return this.pdata;
        })
      )
      .catch(err => console.log(err));
  }	 	

}