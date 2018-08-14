"use strict";
import React, { Component } from "react";
import {
    Text,
    View,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Alert,
    KeyboardAvoidingView
} from "react-native";
import css from "../Forms/style";
import { Languages, Style, gAnalytics, Images } from "@common";
import { SpinkitLarge, TabBarIcon } from "@components";
import { inject, observer } from "mobx-react";

@inject("stores")
@observer
export default class UpdateBlogScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            title: "",
            body: "",
            token: "",
            store_id: 0,
            date: "",
            submitText: "Update",
            storename: "",
            userid: null,
            hideHome: false,
            blogId : 0,
        };

        gAnalytics.trackScreenView("BlogEditPage");
    }

    static navigationOptions = ({ navigation }) => {
        const { navigate } = navigation;
        const { params = {} } = navigation.state;
        return { title: "Edit Blog" };
    };

    componentWillMount() {
        const { navigate, goBack, state } = this.props.navigation;
       
        let { token, blogId, store_id } = state.params;

        this.setState({
                store_id: store_id,
                token: token,
                blogId: blogId,
            },
            () => {
                this.getBlogById(this.state.blogId);
            }
        );
    }

    handleAnalytics() {
        this.props.stores.user
            .getuserInfoBasic()
            .then(data => {
                let d = JSON.parse(data);
                this.setState({ userid: d.id });
                gAnalytics.setUser(d.id.toString());
            })
            .catch(err => console.log(err));
        gAnalytics.trackEvent('blogit', 'edit', { name: 'EditBlogPage' , id : this.state.blogId })
    }

    getBlogById(bid){
        this.props.stores.blog
            .getBlog(bid)
            .then(res => {
                this.setState({
                    blog: res, 
                    title: res.title,
                    body :res.body,
                    store_id : res.store_id,
                    animating: false },
                () => {
                    this.handleAnalytics()
                });
            })
            .catch(err => console.log(err));
    }

    btnEditBlog() {
        if (this.state.title.trim() !== "" && this.state.body.trim() !== "") {
            if (this.state.body.length < 150) {
                Alert.alert("Blog body should be more than 150 characters long");
            } else if (this.state.body.length > 10000) {
                Alert.alert("Blog body exceeds the character limit");
            } else {
                this.setState({ loading: true });
                let cdate = new Date().toISOString().slice(0, 10);
                let data = {
                    publish_date: cdate,
                    blogId : this.state.blogId, 
                    store_id: this.state.store_id,
                    token: this.state.token,
                    title: this.state.title,
                    body: this.state.body
                };

                this.props.stores.blog
                    .updateBlog(data)
                    .then(success => {
                        if (success.status == "success") {
                            this.setState({
                                loading: false,
                            }, () => {
                                gAnalytics.trackEvent('blogit', 'edit', { userId: this.state.userid , blogId : this.state.blogId })
                            });
                            Alert.alert(
                                success.message,
                                null,
                                [{ text: "OK", onPress: () => this.props.navigation.goBack() }],
                                { cancelable: false }
                            );
                        } else {
                            this.setState({ loading: false });
                            Alert.alert(success.message);
                        }
                    })
                    .catch(e => console.log(e));
            }
        } else {
            Alert.alert("Missing one or more field.");
        }
    }

    onScrollEvent = (e) => {
        if (e.nativeEvent.contentOffset.y > 30) {
            this.setState({
                hideHome: true
            })
        } else {
            this.setState({
                hideHome: false
            })
        }
    }

    render() {
        if (this.state.loading) {
            return <SpinkitLarge />;
        }
        return (
		<View style={Style.container}>
            <ScrollView style={css.wrap} keyboardShouldPersistTaps={'handled'} onScroll={this.onScrollEvent}>
                <KeyboardAvoidingView behavior={'padding'}>
                    <View style={css.body}>
                        <View style={css.wrapForm}>
                            {/*Title*/}
                            <View style={css.textInputWrap}>
                                <Text style={css.textLabel}>Title</Text>
                                <TextInput
                                    ref='title'
                                    underlineColorAndroid="transparent"
                                    returnKeyType={"next"}
                                    placeholder="Title"
                                    style={css.textInput}
                                    value={this.state.title}
                                    onChangeText={text => this.setState({ title: text })}
                                    onSubmitEditing={(event) => {
                                        this.refs.commentInput.focus();
                                    }}
                                />
                            </View>

                            {/*Comment*/}
                            <ScrollView style={css.textInputWrap}>
                                <Text style={css.textLabel}>Body</Text>
                                <Text style={{ textAlign: 'right', marginRight: 5, marginBottom: 5 }} >{this.state.body.length}{'/10000'}</Text>
                                <TextInput
                                    ref='commentInput'
                                    underlineColorAndroid="transparent"
                                    multiline={true}
                                    numberOfLines={14}
                                    maxLength={10000}
                                    value={this.state.body}
                                    placeholder="Enter blog body"
                                    style={css.textInput_large}
                                    onChangeText={text => this.setState({ body: text })}
                                />
                            </ScrollView>

                            {/*Buttons*/}
                            <View style={css.wrapButton}>
                                <TouchableOpacity
                                    style={css.btnLogIn}
                                    onPress={this.btnEditBlog.bind(this)}>
                                    <Text style={css.btnLogInText}>
                                        {" "}{this.state.submitText}{" "}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </KeyboardAvoidingView>
                {/*
                    !this.state.hideHome ?
                        <View style={[Style.fixedFooter, { width: 50, height: 50, borderRadius: 100, right: '4%', bottom: '3%', flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }]}>
                            <TouchableOpacity style={Style.iconFixFooter} onPress={() => this.props.navigation.navigate('Main')}>
                                <TabBarIcon icon={Images.icons.news} tintColor={'#fff'} />
                            </TouchableOpacity>
                        </View> : null
                */}
            </ScrollView>
			
			<View style={Style.fixedFooter}>
							 <TouchableOpacity style={Style.iconFixFooter} onPress={() => this.props.navigation.navigate('Main')}> 
								 <TabBarIcon icon={Images.icons.news} tintColor={'#fff'} />
							 </TouchableOpacity>
							  <TouchableOpacity style={Style.iconFixFooter} onPress={() => this.props.navigation.navigate('Designers')}> 
								 <TabBarIcon icon={Images.icons.user} tintColor={'#fff'} />
							 </TouchableOpacity>
							  <TouchableOpacity style={Style.iconFixFooter} onPress={() => this.props.navigation.navigate('Favorites')}> 
								 <TabBarIcon icon={Images.icons.star} tintColor={'#fff'} />
							 </TouchableOpacity>
						</View>
			
          </View>
        );
    }
}

/* <Text style={{textAlign:'right'}} >{this.state.body.length}{'/10000'}</Text>*/