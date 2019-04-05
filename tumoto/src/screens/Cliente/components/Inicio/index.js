import React, { Component } from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity, Image} from 'react-native'

motos = [
    {id:"1", placa: 'Placa 1', modelo: 'Bwis', km: 1120},
    {id:"2", placa: 'Placa 2', modelo: 'Crypton', km:6875},
    {id:"3", placa: 'Placa 2', modelo: 'Best', km: 12457},
]


class Inicio extends Component{

    _renderItem = ({item}) => {
        return (
            <TouchableOpacity>
                <View
                    style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',}}>
                    <View style={{flexDirection:'row'}}>
                        <Image style={{width:40,height:40}} source={require('../../../../../assets/motorcycle.png')}/>
                        <View style={{marginLeft: 8}}>
                            <Text style={styles.modelo}>{item.modelo}</Text>
                            <Text style={styles.placa}>{item.placa}</Text>
                        </View>
                    </View>
                    <Text>{item.km} Km</Text>
                </View>
            </TouchableOpacity>
        )
    }

    _renderSeparador(){
        return (
            <View style={{height: 1,width: "100%",backgroundColor: "rgba(0,0,0,0.05)",marginLeft: "7%"}}/>
        )
    }

    render(){
        return (
            <View style={styles.contenido}>
                <FlatList
                    keyExtractor={(item, index) => item.id}
                    renderItem={this._renderItem.bind(this)}
                    ItemSeparatorComponent={this._renderSeparador}
                    data={motos}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    contenido:{
        flex: 1,
        height: '100%',
        padding: 16,
    },
    modelo:{
        fontSize:20,
        color:'black',
        fontWeight: 'bold',
    },
    placa:{
        fontSize: 15
    }
})

export default Inicio