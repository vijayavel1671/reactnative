import React from 'react';
import {View, Text, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {Color, Config} from "@common";

const styles = StyleSheet.create({
  tabbar: {
    height: 49,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderTopColor: '#eee',
    backgroundColor: '#041D44' 
  },
  tab: {
    alignSelf: 'stretch',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default class TabBar extends React.Component{
  onPress(index) {
    const animateFunc = Config.tabBarAnimate;
    this.refs["tabItem" + index][animateFunc](600);
    this.props.jumpToIndex(index);
  }

  render() {
    const {
      navigation,
      renderIcon,
      activeTintColor,
      inactiveTintColor,
      jumpToIndex
    } = this.props;

    const {routes} = navigation.state;

    return (

      <View style={styles.tabbar}>
        {routes && routes.map((route, index) => {
          const focused = index === navigation.state.index;
          const tintColor = focused ? activeTintColor : inactiveTintColor;
          // if (route.key == 'postDetail') {
          //   return <View key={route.key} />
          // }
          return (
            <TouchableWithoutFeedback
              key={route.key}
              style={styles.tab}
              onPress={this.onPress.bind(this, index)}>
              <Animatable.View
                ref={"tabItem" + index}
                style={styles.tab}>
                {renderIcon({
                  route,
                  index,
                  focused,
                  tintColor
                })}
              </Animatable.View>
            </TouchableWithoutFeedback>
          );
        })}

      </View>
    );
  }
}

