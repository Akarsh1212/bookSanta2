import React from 'react'
import {View , Text} from 'react-native'
import {Component} from 'react'
import { Dimensions, Animated ,StyleSheet, TouchableHighlight } from 'react-native'
import { ListItem , Icon } from 'react-native-elements'
import { SwipeListView } from 'react-native-swipe-list-view'
import db from '../config'
import { render } from 'react-dom'

export default class SwipeAbleFlateList extends Component{
    constructor(props){
        super(props)
        this.state = {
            allNotifications : this.props.allNotifications
        }
    }
    render(){
        return(
            <View style = {styles.container}>
                <SwipeListView disableRightSwipe
                data = {this.state.allNotifications}
                renderItem = {this.renderItem}
                renderHiddenItem = {this.renderHiddenItem}
                rightOpenValue = {-Dimensions.get('window').width}
                previewRowKey = {'0'}
                previewOpenValue = {-40}
                previewOpenDelay = {this.onSwipeValueChange}/>
            </View>
        )
      }
      
    updateMarkAsRead = notification =>{
        db.collection("all_notifications")
        .doc(notification.doc_Id)
        .update({
            notification_status : "Read"
        })
    }
    
}
onSwipeValueChange = swipeData =>{
    var allNotifications = this.state.allNotifications;
    const {key , value} = swipeData
    if (value<-Dimensions.get("window").width){
        const newData = [...allNotifications]
        this.updateMarkAsRead(allNotifications[key])
        newData.splice(key,1)
        this.setState({
            allNotifications : newData
        })
    }
    renderItem = data =>{
        <ListItem leftElement = {<icon Name = "Book" type = "Font-awesome" color = "red"/>}
        title = {data.item.book.name}
        titleStyle = {{color : 'black', fontWeight : 'bold'}}
        subtitle = {data.item.message}
        bottomDivider></ListItem>
        
    }
    renderHiddenItem = ()=>{
        <View style = {styles.rowBack}>
            <View style = {[styles.backRightBtn, styles = backRightBtnRight]}>
                <Text style = {styles.backTextWhite}></Text>
            </View>
        </View>
    }
    
}