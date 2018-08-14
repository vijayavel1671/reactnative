import { AsyncStorage, Alert } from "react-native";
import { action, observable, computed } from "mobx";
import React, { Component } from "react";
import { Config } from "@common";

export default class MiscStore {
		@observable newarrivalData = [];

	@action("get new arrivals data")
	getNewArrivals(lat,long){
		let d = {};
		if(lat && long){
			d = {
				latitude : lat,
				longitude : long
			}
		}
		return fetch(Config.ApiUrl + "newarrivals",{
						      method: "POST",
						      headers: {
						        Accept: "application/json",
						        "Content-Type": "application/json"					        
						      },
						      body: JSON.stringify(d)
						    })
				.then( res => res.json())
				.then(action("newarrivals_fetch_success", response => {
						return response;
				}))
				.catch( err => {
						console.log(err)
				})
	}


	@action("get articles,blogs,offers")
	getArticles(){
			return fetch(Config.ApiUrl + "who-what-wear?page=all")
						.then( res => res.json())
						.then(action("articles_fetch_access", response => {
								return response;
						}))
	}

	@action("get article details")
	getArticleById(articleid){
		return fetch(Config.ApiUrl + "article/"+articleid)
						.then( res => res.json())
						.then(action("article_by_id_fetch_access", response => {
								return response;
						}))
	}

	@action("get all designers")
	getDesigners(){
		return fetch(Config.ApiUrl + "designers?page=all")
						.then( res => res.json())
						.then(action("designers_fetch_access", response => {
									return response
						}))
	}

	@action("Contact Us")
	submitContactUs(data){
		return fetch(Config.ApiUrl + "contact-us", {
						      method: "POST",
						      headers: {
						        Accept: "application/json",
						        "Content-Type": "application/json",
						      },
						      body: JSON.stringify({
						        query  : data.query,
						        phone : data.phone,
						        name : data.name,
						        email : data.email
						      })
						    })
						.then( res => res.json())
						.then(action("submit_contact_us_fetch_access", response => {
									return response;
						}))			
	}

	@action('submit feedback')
	submitFeedback(data){
		return fetch(Config.ApiUrl + "feedback", {
			      method: "POST",
			      headers: {
			        Accept: "application/json",
			        "Content-Type": "application/json",
			        "Authorization": "Bearer " + data.token		
			      },
			      body: JSON.stringify({
			        comment  : data.comment,
			        type : 'mobile',
			        status : 'pending'
			      })
			    })
			.then( res => res.json())
			.then(action("submit_feedback_fetch_access", response => {
						return response;
			}))
	}

	@action("Report Error")
	submitErrorReport(data){
				return fetch(Config.ApiUrl + "error-report",{
						      method: "POST",
						      headers: {
						        Accept: "application/json",
						        "Content-Type": "application/json",
								"Authorization": "Bearer " + data.token						        
						      },
						      body: JSON.stringify({
						        store_id  : data.store_id,
					        	type : 'mobile',
						        error_type  : data.error_type,
						        title : data.title,
						        comment : data.comment
						      })
						    })
						.then( res => res.json())
						.then(action("submit_error_report_fetch_access", response => {
									return response
						}))		
	}


	@action("ask a question")
	submitQuestion(data){
		return fetch(Config.ApiUrl + "askquestion",{
		      method: "POST",
		      headers: {
		        Accept: "application/json",
		        "Content-Type": "application/json",
				"Authorization": "Bearer " + data.token						        
		      },
		      body: JSON.stringify({
		        store_id  : data.store_id,
		        question : data.question
		      })
		    })
		.then( res => res.json())
		.then(action("submit_question_fetch_access", response => {
					return response
		}))	
	}

	@action("get list of countries")
	getCountries(){
		return fetch(Config.ApiUrl + "countries")
						.then( res => res.json())
						.then(action("countries_fetch_access", response => {
								if(response.status == "success")
									return response.countries
								else
									Alert.alert("Error occured while getting Countries")
						}))
	}

	@action("get all states")
	getStatesAll(){
		return fetch(Config.ApiUrl + "states")
						.then( res => res.json())
						.then(action("countries_fetch_access", response => {
								if(response.status == "success")
									return response.states
								else
									Alert.alert("Error occured while getting States")
						}))		
	}

	@action("get all cities")
	getAllCities(){
		return fetch(Config.ApiUrl + "cities")
						.then( res => res.json())
						.then(action("countries_fetch_access", response => {
								if(response.status == "success")
									return response.cities
								else
									Alert.alert("Error occured while getting States")
						}))			
	}

	@action("get states by country id")
	getStatesByCntryid(countryid){
		return fetch(Config.ApiUrl + "state/" +countryid)
						.then( res => res.json())
						.then(action("states_fetch_access", response => {
								if(response.status == "success")
									return response.state
								else
									Alert.alert("Error occured while getting States")
						}))		
	}
	
	@action("get cities by state")
	getCitiesByState(stateid){
				return fetch(Config.ApiUrl + "city/" +stateid)
						.then( res => res.json())
						.then(action("city_fetch_access", response => {
								if(response.status == "success")
									return response.city
								else
									Alert.alert("Error occured while getting States")
						}))					
	}
   
   @action("api check version")
   getApiVersion(){
   		return fetch(Config.ApiUrl + "version-check/" + Config.AppVersion)
   					.then(res => res.json())
   					.then(action("get_api_version_success", response => {
   							return response
   					}))
   }

  @action("global search")
  search(q,page){
		return fetch(Config.ApiUrl + "search?search=" + q + "&page=" + page)
					.then(res => res.json())
					.then(action("get_global_search_success", response => {
							return response
					}))
  } 
}