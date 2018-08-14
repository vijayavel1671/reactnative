'use strict';

import {AsyncStorage} from "react-native";
import {Events, Constants, warn} from '@common';
import URI from "urijs";
import {AllHtmlEntities} from 'html-entities';
import truncate from 'lodash/truncate';

export default class Tools {

	/**
	 * refresh the tab bar & read later page
	 */
	static refresh() {
		Events.loginRefresh();
		Events.homePageRefresh();
		Events.sideMenuRefresh();
	}

	static getImage(data, imageSize) {
		if (typeof data == 'undefined' || data == null) {
			return '';
		}
		if (typeof imageSize == 'undefined')    {
			imageSize = 'medium';
		}

		const getImageSize = (mediaDetail) => {
      let imageURL = '';
      if (typeof mediaDetail['sizes'] != 'undefined') {
        if (typeof mediaDetail['sizes'][imageSize] != 'undefined') {
          imageURL = mediaDetail['sizes'][imageSize]['source_url'];
        }

        if (imageURL == '' && typeof mediaDetail['sizes']['medium'] != 'undefined')   {
          imageURL = mediaDetail['sizes']['medium']['source_url'];
        }

        if (imageURL == '' && typeof mediaDetail['sizes']['full'] != 'undefined')   {
          imageURL = mediaDetail['sizes']['full']['source_url'];
        }
      }
      return imageURL;
		}

		var imageURL = typeof data.better_featured_image != 'undefined' &&  data.better_featured_image != null ? data.better_featured_image.source_url : '';

    if (typeof data.better_featured_image != 'undefined' &&
      typeof data.better_featured_image['media_details'] != 'undefined') {
      imageURL = getImageSize(data.better_featured_image['media_details'])
    }

		if (imageURL == '') {
			return Constants.placeHolderImage;
		}
		return imageURL;
	}

	static getLinkVideo(content) {
		const regExp = /^.*((www.youtube.com\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\??v?=?))([^#&\?\/\ ]*).*/;
		var embedId = '';
		var youtubeUrl = '';

		URI.withinString(content, function (url) {
			var match = url.match(regExp);
			if (match && match[7].length === 11) {
				embedId = match[7];
        youtubeUrl = "www.youtube.com/embed/" + embedId;
			}
		});
		return youtubeUrl;
	}

	static async getFontSizePostDetail() {
		const data = await AsyncStorage.getItem('@setting_fontSize');
		if (typeof data != 'undefined') {
			return parseInt(data);
		}
		return Constants.fontText.size;
	}

	static getDescription(desc, limit) {
		if (typeof limit == 'undefined') {
			limit = 50
		}
		var desc = desc.replace('<p>', '');
		desc = truncate(desc, {'length': limit,  'separator': ' '}) ;

		return AllHtmlEntities.decode(desc);
	}

	static viewCateDetail(categoryId) {
    	Events.homePageSetActiveCate(categoryId);
  	}
}
