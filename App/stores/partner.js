/* @flow */
import { action, observable, stores } from "mobx";
import { Config } from "@common";
import { AsyncStorage, Alert } from "react-native";
export default class ShopsStore {
  @observable partnerdata = [];
  @observable nearbydata = [];
  @observable offers = [];
  @observable showcasedata = [];
  @observable designerList = [];
  @observable partnerSlider = [];
  @observable pdata = [];
  @observable animating = true;
  @observable isBookmarked = false;
  @observable isBeenHere = false;
  @observable isBookmarkRemoved = false;
  @observable isBeenHereRemoved = false;
  @observable gallerydata = [];
  @observable usergallerydata = [];
  @observable recentdata = [];
  @action("get all partners by category")
  fetchData(cid, page, lat, long) {
    let b = {};

    if(lat && long)
    {
       b = {
          latitude : lat,
          longitude : long
        }
      }
    return fetch(Config.ApiUrl + "storebycategory/"+ cid +"?page=" + page, {
      method: "POST",
       headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
        },
        body: JSON.stringify(b)
      })
      .then(res => res.json())
      .then(
        action("stores_list_fetch_success", responseJson => {
          if (responseJson.status == "success") {
            this.animating = false;
            this.partnerdata = responseJson.stores;
          } else {
            this.animating = false;
            this.partnerdata = [];
          }
          return this.partnerdata;
        })
      )
      .catch(error => {
        console.log(error);
      });
  }
  @action("fetch nearby data")
  fetchNearByMe(lat, long, page , storeid = 0) {
    let bd = {};
      if(lat && long){
       bd = {
        latitude : lat,
        longitude : long
        }
      }

    return fetch(Config.ApiUrl + "nearby?page=" + page, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(bd)
    })
      .then(res => res.json())
      .then(
        action("stores_list_nearby_fetch_success", responseJson => {
           if (responseJson.status == "success") {
              this.nearbydata = responseJson.stores;
          } else {
            this.nearbydata = [];
          }
          return this.nearbydata;
        })
      )
      .catch(error => {
        console.log(error);
      });
  }
  @action("Get Partner by ID")
  getPartnerData(stid) {
    /*Check for user auth*/
    return AsyncStorage.getItem("usertoken")
    .then(item => {
      if (!item) {
        let header = {
          Accept: "application/json",
          "Content-Type": "application/json"
        };
      } else {
          let header = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + item
          };
        }
        return fetch(Config.ApiUrl + "store/" + stid, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + item
          }
        })
          .then(res => res.json())
          .then(
            action("store_data_fetch_success", responseJson => {
              return responseJson;
            })
          )
          .catch(error => {
            console.log(error);
          });
      })
      .catch(err => console.log(err));
  }
  @action("get offers")
  fetchOffers() {
    return fetch(Config.ApiUrl + "offers")
      .then(response => response.json())
      .then(
        action("offers_fetch_success", responseJson => {
          this.offers = responseJson.offers;
          this.activity = false;
        })
      )
      .catch(error => {
        console.error(error);
      });
  }
  @action("search for boutiques")
  fetchBoutiques(q,lat,long){
    let d = {};
    if(lat && long){
      d = {latitude : lat,longitude:long,search:q}
    }else{
      d = {search : q}
    }

    return fetch(Config.ApiUrl + "store/search" , {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(d)
      })
      .then(res => res.json())
      .then(
        action("fetch_store_by_q_success", responseJson => {
          if (responseJson.status == "success") {
            this.pdata = responseJson.stores;
          } else {
            this.pdata = [];
          }
          return this.pdata;
        })
      )
      .catch(err => console.log(err));
  }
  
  /*For directory*/
  @action("get boutiques directory")
  getBoutiques(lat, long) {
    let d = {};
    if(lat && long){
      d = { latitude : lat , longitude : long}
    }

    return fetch(Config.ApiUrl + "store-directory", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(d)
      })
      .then(res => res.json())
      .then(
        action("all_partners_fetch_access", response => {
             return response
        })
      );
  }
  @action("bookmark store")
  bookmarkPartner(sid, token, bmaction) {
    if (token.length == 0) {
      Alert.alert("You must be logged in to bookmark.");
    } else {
      return fetch(Config.ApiUrl + "bookmark", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
        body: JSON.stringify({
          action: bmaction,
          reference_id: sid,
          reference_type: "store"
        })
      })
        .then(res => res.json())
        .then(
          action("bookamark_api_success", responseJson => {
            console.log(responseJson);
            return responseJson;
          })
        )
        .catch(error => {
          console.log(error);
        });
    }
  }
  @action("add been here of given store")
  beenherePartner(sid, token, beenaction) {
    if (token.length == 0) {
      Alert.alert("You must be logged in to check Been Here.");
    } else {
      return fetch(Config.ApiUrl + "beenhere", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
        body: JSON.stringify({
          action: beenaction,
          store_id: sid,
          is_approved: "1"
        })
      })
        .then(res => res.json())
        .then(
          action("beenhere_api_success", responseJson => {
            return responseJson;
          })
        )
        .catch(error => {
          console.log(error);
        });
    }
  }
  @action("get store gallery")
  getStoreGallery(storeid) {
    return fetch(Config.ApiUrl + "store/gallery/" + storeid)
      .then(res => res.json())
      .then(
        action("store_gallery_fetch_access", response => {
          return response;
        })
      );
  }
  @action("get store user gallery")
  getStoreUserGallery(storeid) {
    return fetch(Config.ApiUrl + "store/usergallery/" + storeid)
      .then(res => res.json())
      .then(
        action("store_user_gallery_fetch_access", response => {
          return response;
        })
      );
  }
  @action("get store collection Products")
  getstcp(cid) {
    return fetch(Config.ApiUrl + "store/collection/" + cid)
      .then(res => res.json())
      .then(
        action("store_collection_products_fetch_access", response => {
          return response;
        })
      );
  }
  @action("get load more blogs")
  LoadMoreBlogs(store, page) {
    return fetch(Config.ApiUrl + "blog-list/" + store + "?page=" + page)
      .then(res => res.json())
      .then("get_more_blogs_api_success", response => {
        return response;
      });
  }
  @action("store offers and events")
  getOE(storeid) {
    return fetch(Config.ApiUrl + "store/offers-and-events/" + storeid)
      .then(res => res.json())
      .then("fetch_store_offers_api_success", response => {
        return response;
      });
  }

  @action("offer details")
  getOfferDetails(offerid){
    return fetch(Config.ApiUrl + "offer/" + offerid)
      .then(res => res.json())
      .then("fetch_store_offer_byID_api_success", response => {
        return response;
      });
  }

  @action("recently viewed stores")
  recentViewStores(token) {
    return fetch(Config.ApiUrl + "recentlyviewed", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      }
    })
      .then(res => res.json())
      .then(
        action("fetch_recently_viewed_success", responseJson => {
          if (responseJson.status == "success") {
            this.recentdata = responseJson;
          }
          return responseJson;
        })
      )
      .catch(err => {
        console.log(err);
      });
  }
  @action("submit blog for store")
  submitBlog(data) {
    return fetch(Config.ApiUrl + "blog/add", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + data.token
      },
      body: JSON.stringify({
        title: data.title,
        store_id: data.store_id,
        publish_date: data.publish_date,
        body: data.body,
        status: "active"
      })
    })
      .then(res => res.json())
      .then(
        action("submit_blog_api_success", responseJson => {
          return responseJson;
        })
      )
      .catch(error => {
        console.log(error);
      });
  }

  
}