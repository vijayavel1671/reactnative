import { AsyncStorage, Alert } from "react-native";
import { action, observable, computed } from "mobx";
import React, { Component } from "react";
import { Config } from "@common";

export default class BlogStore {
	@observable bloggerData = [];
	@observable blogData = [];
	@observable bloggers = [];

	@action("Get Blogger Data")
	getBlogger(did,token){
		return fetch(Config.ApiUrl + "blogger/" + did,{
							method: "GET",
					        headers: {
					          Accept: "application/json",
					          "Content-Type": "application/json",
					          Authorization: "Bearer " + token
					        }
			        })
			.then(res => res.json())
			.then(
				action("fetch_blogger_success", responseJson => {
					if (responseJson.status == "success") {
						this.bloggerData = responseJson;
					} else {
						this.bloggerData = [];
					}

					return this.bloggerData;
				})
			)
			.catch(error => {
				console.log(error);
			});
	}

	@action("Get blog by id")
	getBlog(id) {
		return fetch(Config.ApiUrl + "blog/" + id)
			.then(res => res.json())
			.then(
				action("blog_by_id_success", responseJson => {
					if (responseJson.status == "success") {
						this.blogData = responseJson.blog;
					} else {
						this.blogData = [];
					}
					return this.blogData;
				})
			)
			.catch(error => console.log(error));
	}

	@action("update blog")
	updateBlog(data) {
		return fetch(Config.ApiUrl + "blog/edit/" + data.blogId, {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				"Authorization": "Bearer " + data.token
			},
			body: JSON.stringify({
				blogid: data.blogId,
				title: data.title,
				body: data.body,
				publish_date: data.publish_date,
				store_id: data.store_id,
				status: 'active'
			})
		})
			.then(res => res.json())
			.then(
				action("update_blog_success", responseJson => {
					return responseJson;
				})
			)
			.catch(error => {
				console.log(error);
			});

	}

	@action("Get all bloggers")
	getBloggers(){
				return fetch(Config.ApiUrl + "bloggers")
						.then( res => res.json())
						.then(action("bloggers_fetch_access", response => {
									return response
						}))
	}

	@action("bookmark or add to favorite a blogger")
	bookmarkBlogger(id,token,bmaction){
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
		          reference_type : 'blogger'
		        })
		      })
		        .then(res => res.json())
		        .then(
		          action("blogger_bookamark_api_success", responseJson => {
		            return responseJson;
		          })
		        )
		        .catch(error => {
		          console.log(error);
		        });
	}	

  @action("get load more blogs")
	  LoadMoreBlogs(blogger, page) {
	    return fetch(Config.ApiUrl + "blogger/blog-list/" + blogger + "?page=" + page)
	      .then(res => res.json())
	      .then("blogger_get_more_blogs_api_success", response => {
	        return response;
	      });
	  }

	@action("search bloggers")
	  fetchBloggers(q){
	    return fetch(Config.ApiUrl + "blogger/search?search=" + q)
	      .then(res => res.json())
	      .then(
	        action("fetch_blogger_by_q_success", responseJson => {
	          if (responseJson.status == "success") {
	            this.bloggers = responseJson.bloggers;
	          } else {
	            this.bloggers = [];
	          }
	          return this.bloggers;
	        })
	      )
	      .catch(err => console.log(err));
	  }	 		  
}