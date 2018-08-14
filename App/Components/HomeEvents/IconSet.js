import React, { Component } from 'react'
import { Image,  TouchableOpacity  } from 'react-native'

export default class IconSet extends Component {

  constructor(props) {
    super(props)
  
    this.state = {
      flag:1
    }
  }
  

  callFun(item){
      let flag_status=1;
      if(this.state.flag==1){
        flag_status=0;
      }
      this.setState({flag:flag_status})
  }

  render() {
    const{data,type}=this.props;
    let white_image="";
    let yellow_image="";

    switch (type) {
        case 'star':
            white_image=require('../../assets/Images/star.png');
            yellow_image=require('../../assets/Images/star-yellow.png');
            
        break;
        case 'check':
            white_image=require('../../assets/Images/chk.png');
            yellow_image=require('../../assets/Images/chk-yellow.png');
            
        break;
        case 'back':
            white_image=require('../../assets/Images/back.png');
            yellow_image=require('../../assets/Images/back-yellow.png');
            
        break;
        case 'time':
            white_image=require('../../assets/Images/time.png');
            yellow_image=require('../../assets/Images/time-yellow.png');
            
        break;     
        
    }

    return (
        <TouchableOpacity activeOpacity = { .5 } onPress={ () => {this.callFun(data)}}>
         <Image  style={{padding:1}} resizeMode='contain' source={this.state.flag?white_image :  yellow_image} />
        </TouchableOpacity>
    )
  }
}