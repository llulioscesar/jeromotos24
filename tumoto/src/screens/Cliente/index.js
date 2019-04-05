import React, {Component} from 'react'
import {View, StyleSheet} from 'react-native'
import { Body, Header, Title } from "native-base";
import BottomNavigation, { IconTab, FullTab } from 'react-native-material-bottom-navigation'
import IconImage from '../../components/UI/IconImage'

import Inicio from './components/Inicio'

class Cliente extends Component{

    constructor(props){
        super(props)

        this.state = {
            activeTab: null
        }
    }

    tabs = [
        {key: 'info', icon:'info'},
        {key: 'servicios', icon: 'engine'},
        {key: 'notificacion', icon: 'bell'},
        {key: 'configuracion', icon: 'improve'},
    ]

    _renderIcon = icon => ({isActive}) => (
        <IconImage size={{ width: 24, height: 24 }} name={isActive ? icon + "-color" : icon}/>
    )

    _renderTab = ({ tab, isActive }) => (
        <IconTab
            isActive={isActive}
            key={tab.key}
            renderIcon={this._renderIcon(tab.icon)}
        />
    )


    render(){

        let vista = <Inicio/>

        return (
            <View style={styles.contenido}>
                <Header androidStatusBarColor="#c30005" style={styles.header}>
                    <Body>
                        <Title>Tu Moto</Title>
                    </Body>
                </Header>
                {
                    vista
                }
                <BottomNavigation
                    style={{height:48}}
                    onTabPress={newTab => this.setState({activeTab:newTab.key})}
                    renderTab={this._renderTab}
                    tabs={this.tabs}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    contenido:{
        flex:1,
        height:'100%',
    },
    header:{
        backgroundColor:'rgb(255,59,48)'
    }
})

export default Cliente