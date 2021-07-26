import React, { Component} from 'react';
import {StyleSheet, View, Text,TouchableOpacity} from 'react-native';
import { DrawerItems} from 'react-navigation-drawer'
import {Avatar} from 'react-native-elements'
import { db } from './c'
import *as ImagePicker from "expo-image-picker" 
import firebase from 'firebase';
import { QuerySnapshot } from '@firebase/firestore-types';

export default class CustomSideBarMenu extends Component{
  state = {
    userId : firebase.auth().currentUser.email ,
    image : '#',
    name : '#',
    docId : '#',

  }
  selectPicture = async()=>{
    const {
      cancelled,uri
    }=await ImagePicker.launchImageLibraryAsync({
      mediaTypes : ImagePicker.mediaTypesOptions.all,
      allowsEditing : true,
      aspect : [4,3],
      quality : 1
    })
    if(!cancelled){
      this.setState({
        Image : uri
      })
      this.uploadeImage(uri,this.state.userId)
    }
  }
  getUserProfile(){
    db.collection("users")
    .where("email_Id","==",this.state.userId)
    .onSnapShot((QuerySnapshot)=>{
      QuerySnapshot.forEach ((doc)=>{
        this.setState({
          name : doc.data().first_name+""+doc.data().last_name
        })
      })
    })
  }

  uploadeImage = async(uri,imageName)=> {
    var response = await fetch(uri)
    var blob = await response.blob()
    var ref = firebase
    .storage()
    .ref()
    .child("user_profile/" + imageName)
    return ref.put(blob).then((response)=>{
      this.fetchImage(imageName)
    })
    

  }
  componentDidMount(){
    this.fetchImage(this.state.userId)
    this.getUserProfile()
  }
  render(){
    return(
      <View style = {{ flex :1}}>
      <View style = {{flex : 0.5 , alignItems : 'center', backgroundColor : 'orange'}}>  
      <Avatar rounded source  = {{uri : this.state.image}}
      size = "medium"
      onPress = {
        ()=>this.selectPicture()
      }
      containerStyle = {styles.imageContainer}
      showEditButton >

      </Avatar>
      <Text style = {{fontWeight : "100", fontSize : 20, paddingTop : 10}}>
        {this.state.name}
      </Text>
      </View>
        <View style={styles.drawerItemsContainer}>
          <DrawerItems {...this.props}/>
        </View>
        <View style={styles.logOutContainer}>
          <TouchableOpacity style={styles.logOutButton}
          onPress = {() => {
              this.props.navigation.navigate('WelcomeScreen')
              firebase.auth().signOut()
          }}>
            <Icon
            name = "Log out"
            type = "antDesign"
            size = {RFValue (20)}
            iconStyle = {{pagginLeft : RFValue(10)}}
            >
            </Icon>
            <Text style = {{fontSize : RFValue(15),
            fontWeight : 'bold',
            marginLeft : RFValue(30)}}></Text>
            <Text>Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

var styles = StyleSheet.create({
  container : {
    flex:1
  },
  drawerItemsContainer:{
    flex:0.8
  },
  logOutContainer : {
    flex:0.2,
    justifyContent:'flex-end',
    paddingBottom:30
  },
  logOutButton : {
    height:30,
    width:'100%',
    justifyContent:'center',
    padding:10
  },
  logOutText:{
    fontSize: 30,
    fontWeight:'bold'
  }
})
