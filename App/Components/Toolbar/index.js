'use strict';

import React, {Component} from "react";
import {Text, View, Platform, TouchableOpacity, Image} from "react-native";
import Icon from "@expo/vector-icons/SimpleLineIcons";
import css from "@common/style";
import { IconImage } from "@components";
import {Constants, Config, Events, Languages, Images} from '@common';
import Icons from '@navigation/Icons';

export default class Toolbar extends Component {
	constructor(props) {
		super(props);
		this.state = {layout: Constants.Layout.simple}
	}
	open() {
		Events.openLeftMenu();
	}

	changeLayout(layout) {
		this.setState({layout: layout});
		Events.newsChangeLayout(layout);
		Events.readLaterChangeLayout();
	}

  showUserModal() {
		this.props.navigation.navigate('login');
	}

	render() {
    const self = this;
		const logo = () => {
				if (typeof Constants.logo != 'undefined')	{
						return <Image source={Images.logo} style={css.toolbarLogo}></Image>;
					}
					return <Text style={[css.toolbarTitle, self.props.textColor]}>{Config.AppName}</Text>
				};

		const homeButton = function () {
			if (typeof self.props.isChild != 'undefined') {
				return (
					<View style={{flexDirection: 'row', alignItems: 'center'}}>
						<TouchableOpacity   onPress={self.props.action ? self.props.action : null}>
							<Icon name={'arrow-left'} size={16} color="#333"
							      style={[ Platform.OS === 'android' ? css.iconBackAndroid : css.iconBack, self.props.textColor]}/>
							<Text style={[css.textBack, {marginLeft: 20}]}>{Languages.back}</Text>
						</TouchableOpacity>

						<TouchableOpacity style={css.toolbarHome}>{logo()}</TouchableOpacity>
					</View>
				);
			}
			return (
				<View>
					<View style={{flexDirection: 'row', zIndex: 99999, left: -6, top: -10, alignItems: 'center'}}>
						<IconImage action={self.open} image={{uri: Images.icons.home}}/>
					</View>
					<TouchableOpacity onPress={self.open} style={css.toolbarTitleView}>
						{typeof self.props.name != 'undefined' ?
							<Text style={[css.toolbarTitle, self.props.textColor]}>{self.props.name}</Text> :
							logo()
						}
					</TouchableOpacity>
				</View>
			);
		};

		return (
			<View style={[css.toolbarMenu, this.props.css]}>
				{homeButton()}

				<View style={{flexDirection: 'row', alignItems: 'center'}}>
					{self.props.cardButton &&
					<IconImage cssImage={[{marginRight: 4}, this.state.layout != 1 && css.iconHide]}
					           action={this.changeLayout.bind(this, 1)}
					           image={{uri: Images.icons.card}}/> }

					{self.props.newsLayoutButton &&
					<IconImage  cssImage={[{marginRight: 4}, this.state.layout != 3 && css.iconHide] }
					            action={this.changeLayout.bind(this, 3)}
					            image={{uri: Images.icons.layout}}/>}

          {self.props.listButton &&
					<IconImage cssImage={[{marginRight: 4}, this.state.layout != 2 && css.iconHide]}
										 action={this.changeLayout.bind(this, 2)}
										 image={{uri: Images.icons.cardView}}/> }

          {self.props.listViewButton &&
					<IconImage cssImage={[{marginRight: 0}, this.state.layout != 4 && css.iconHide]}
										 action={this.changeLayout.bind(this, 4)}
										 image={{uri: Images.icons.listView}}/> }

          {self.props.userButton &&
					<IconImage cssImage={{marginRight: 0}}
										 action={this.showUserModal.bind(this)}
										 image={{uri: Images.icons.user}}/> }

					{self.props.searchButton &&
					<IconImage image={{uri: Images.icons.search}}/> }

          {self.props.layer && Icons.Layer()}
				</View>
			</View>
		);
	}
}
