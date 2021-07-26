import React,{Component} from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  Alert, 
  TouchableHighlight,
  FlatList,} from 'react-native';
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader'
import {BookSearch} from 'react-native-google-books'
import { TouchableHighlight } from 'react-native-gesture-handler';


export default class BookRequestScreen extends Component{


  constructor(){
    super();
    this.state ={
      userId : firebase.auth().currentUser.email,
      bookName:"",
      reasonToRequest:""
    }
  }

  createUniqueId(){
    return Math.random().toString(36).substring(7);
  }

  getBookRequest = ()=>{
    var BookRequest = db.collection("request_Books")
    .where('user_Id','==',this.state.userId)
    .get()
    .then((snapShot)=>{
      snapShot.forEach((doc)=>{
        if(doc.data().book_Status !== "received"){
          this.setState({
            request_id : doc.data().request_id,
            requestBookName : doc.data().book_name,
            bookStatus : doc.data().book_Status,
            docId : doc.Id            
          })
        }
      })
    })
  }

  addRequest =(bookName,reasonToRequest)=>{
    var userId = this.state.userId
    var books = await BookSearch.searchbook(bookName,'AIzaSyA5XSRWFHjl_FE9nXrOhfiFXudV2k8xtxw')
    var randomRequestId = this.createUniqueId()
    db.collection('requested_books').add({
        "user_id": userId,
        "book_name":bookName,
        "reason_to_request":reasonToRequest,
        "request_id"  : randomRequestId,
        "book_Status"  : "requested",
        "Date" : firebase.firestore.FieldValue.serverTimestamp(),
        "Image_Link" : books.data[0].volumeInfo.ImageLinks.smallThunbNail
    })

    db.collection('users')
    .where("email_Id", "==", userId).get()
    .then()
    .then((snapShot)=>{
      snapShot.forEach((doc)=>{
        db.collection('users').doc(doc.Id).update(({
          isBookRequest : true
        }))
      })
    })

    this.setState({
        bookName :'',
        reasonToRequest : ''
    })

    return Alert.alert("Book Requested Successfully")
  }
     getIsBookRequestActive (){
       db.collection('user')
       .where('email_Id', '==',this.state.userId)
       .onSnapshot(querySnapShot => {
         querySnapShot.forEach(doc => {this.setState({
           isBookRequestActive : doc.data().isBookRequestActive,
           userDocId : doc.Id
           
         }
)})
       })
     }
     UpdateBookRequestStatus =()=>{
       db.collection("Requested_Books")
       .doc(this.state.docId)
       .update({
         book_Status : 'Received'
       })
       db.collection('users')
       .where('email_Id', '==', this.state.userId)
       .get()
       .then((snapShot)=>{
         snapShot.forEach((doc) => {
           db.collection('user').doc(doc.id).update(({
             isBookRequestActive : false
           }))
         })
       })
     }

     sendNotification =()=>{
       db.collection('Users')
       .where('emailId','==',this.state.userId)
       .get()
       .then((snapShot)=>{
         snapShot.forEach((doc)=>{
           var name = doc.data().first_Name
           var lastname =  doc.data().last_Name
           db.collection('all_Notification').where('requestId','==',this.state.request_id)
           .get()
           .then((snapShot) =>{
             snapShot.forEach((doc)=>{
               var donnerId = doc.data().donner_Id
               var bookName = doc.data().book_name
             })
           })
         })
       })

     }
     componentDidMount (){
       var books = BookSearch.searchbook(bookName, 'AIzaSyA5XSRWFHjl_FE9nXrOhfiFXudV2k8xtxw')

     }
     async getBooksFromApi (bookName){
       this.setState({
         BookName : BookName
       })
       if(BookName.length>2){
         var books = await BookSearch.searchbook(BookName,'AIzaSyA5XSRWFHjl_FE9nXrOhfiFXudV2k8xtxw')
         this.setState({
           dataSource : books.data,
           showFlateList : true
         })
       }
       renderItem = ({item,i})=>{
         return(
           <TouchableHighlight 
           style = {{alignItems : 'center', backgroundColor : 'red', padding : 10, width : '90%'}} 
           activeOpacity = {0.6}
           underlayColor = {'blue'}
           onPress = {
             ()=>{
               this.setState({
                 showFlateList : false,
                 bookName : item.volumeInfo.title
               })
             }
           }
           bottomDivider>
             <Text> {item.volumeInfo.title} </Text>
             </TouchableHighlight>
         )
       }
     }
  render(){
    if (this.state.isBookRequestActive === true) { 
      return(
        <View style = {{flex : 1,
        justifyContent : 'center'}}>
          
          <View style = {{borderColor : "blue",
                          borderWidth : 2,
                          justifyContent : 'center',
                          alignItems : 'center'}}>
          <Text>
              Book Name
          </Text>
        </View>
        <View style = {{borderColor : 'blue',
                        borderWidth : 2,
                        justifyContent : 'center',}}>

                        <Text>
                          Book Status
                        </Text>

                        </View>
                        <TouchableOpacity style = {{borderWidth : 1,
                                                    borderColor : 'red',
                                                    backgroundColor : 'green',
                                                    width : 300,
                                                    alignItems : 'center',
                        }}>
                          <Text>
                            I received the book
                          </Text>
                        </TouchableOpacity>
                        
        </View>
      )
    }
    return(
        <View style={{flex:1}}>
          <MyHeader title="Request Book" navigation ={this.props.navigation}/>
            <KeyboardAvoidingView style={styles.keyBoardStyle}>
              <TextInput
                style ={styles.formTextInput}
                placeholder={"enter book name"}
                lable = {"BookName"}
                containerStyle = {{marginTop : RFValue(60)}}
                onChangeText = {(text)=>this.getBooksFromApi(text)}
                onClear = {(text)=>this.getBooksFromApi("")}
                value = {this.state.bookName}
                />            
                
                              (<FlatList data = {this.state.dataSource}>
                                renderItem = {this.renderItem}
                                enableEmptySections = {true}
                                style = {{marginTop : 10,}}
                                keyExtractor = {(Item,index)=>index.toString()}
                                </FlatList>)

              <TextInput
                style ={styles.formTextInput}
                placeholder={"Why do you need the Book"}
                
                containerStyle = {{marginTop : RFValue(60)}}
                multiline
                numberOfLines = {8}
                label = {"Reason"}
                onChangeText = {(text)=>this.getBooksFromApi(text)}
                onClear = {(text)=>this.getBooksFromApi("")}
                value = {this.state.bookName}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={()=>{this.addRequest(this.state.bookName,this.state.reasonToRequest)}}
                >
                <Text>Request</Text>
              </TouchableOpacity>
            </KeyboardAvoidingView>
        </View>
    )
  }
}

const styles = StyleSheet.create({
  keyBoardStyle : {
    flex:1,
    alignItems:'center',
    justifyContent:'center'
  },
  formTextInput:{
    width:"75%",
    height:35,
    alignSelf:'center',
    borderColor:'#ffab91',
    borderRadius:10,
    borderWidth:1,
    marginTop:20,
    padding:10,
  },
  button:{
    width:"75%",
    height:50,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:10,
    backgroundColor:"#ff5722",
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
    marginTop:20
    },
  }
)
