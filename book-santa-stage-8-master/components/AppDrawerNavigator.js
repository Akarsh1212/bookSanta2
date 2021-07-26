import React from 'react';
import {createDrawerNavigator} from 'react-navigation-drawer';
import { AppTabNavigator } from './AppTabNavigator'
import CustomSideBarMenu  from './CustomSideBarMenu';
import MyDonationScreen from '../screens/MyDonationScreen';
import NotificationScreen from '../screens/NotificationScreen';
import SettingScreen from '../screens/SettingScreen';
import {Icon} from 'react-native-elements';


export const AppDrawerNavigator = createDrawerNavigator({
  Home : {
    screen : AppTabNavigator,
    navigationOptions : {
      navigationOptions : {
        drawerIcon : <Icon name> "Home" type = "fontAwesome5" </Icon>
      }
    }
    },
  MyDonations : {
    screen : MyDonationScreen,
    navigationOptions : {
      drawerIcon : <Icon name >"gift" type = "font-Awesome"</Icon>
    }
  },
  Notification : {
    screen : NotificationScreen,
    navigationOptions : {
      drawerIcon : <Icon name >"Bell" type = "font-Awesome"</Icon>,
      drawerLabel : "Notificaitons"
    }
  },
  MyReceivedBook : {
    screen : MyReceivedBookScreen,
    navigationOptions : {
      drawerIcon : <Icon name >"gift" type = "font-Awesome"</Icon>,
      drawerLabel : "My Received Books"
    }
  },
  Setting : {
    screen : SettingScreen,
    navigationOptions : {
      drawerIcon : <Icon name >"settings" type = "fontAwesome5"</Icon>,
      drawerLabel : "Settings"
    }
  }
},
  {
    contentComponent:CustomSideBarMenu
  },
  {
    initialRouteName : 'Home'
  })
