/**
 * @format
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react'
import {AppRegistry} from 'react-native';
import App from './src';
import {name as appName} from './app.json';

export default class TuMoto extends Component{
    render(){
        return(<App/>)
    }
} 

AppRegistry.registerComponent(appName, () => TuMoto);
