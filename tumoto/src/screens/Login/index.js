import React, {Component} from 'react';
import {View, Text, ScrollView, ImageBackground, StyleSheet, TextInput} from 'react-native'

import ValidarEmail from '../../utils/validarEmail'
import NavigationAfterFinish from '../../utils/ navigateAfterFinish'

import Boton from '../../components/UI/Boton'

class Login extends Component{

    constructor (props) {
        super(props)

        this.state = {
            email: '1@usuario.com',
            password: '123456',
            loader: false
        }        
    }

    _getDisabled(){
        if(!this.state.email || !ValidarEmail(this.state.email || this.state.email == '')){
            return true
        }
        if(!this.state.password || this.state.password.length < 6){
            return true
        }
        return false
    }

    _login(){
        NavigationAfterFinish('cliente', this.props)
    }



    render(){
        return (
            <ScrollView 
                style={style.pagina}
                contentContainerStyle={{flexGrow: 1}}
                showsVerticalScrollIndicator={false}>

                <ImageBackground 
                    source={require('../../../assets/bg1.jpg')} 
                    resizeMode="cover" 
                    style={{width:'100%', height:'100%'}}>
                        <View style={style.contenedor}>
                            <View style={style.contenido}>

                                <Text style={style.logo}>TuMoto.app</Text>

                                <TextInput
                                    style={style.input}
                                    placeholder="Correo electronico"
                                    keyboardType={'email-address'}
                                    onChangeText={(email) => this.setState({email})}
                                    value={this.state.email}
                                />
                                <TextInput
                                    style={[style.input,{marginTop:5}]}
                                    placeholder="Contraseña"
                                    secureTextEntry={true}
                                    onChangeText={(password) => this.setState({password})}
                                    value={this.state.password}
                                />

                                <Boton
                                    style={{marginTop:10,borderRadius:50}}
                                    color="#ffd300"
                                    textStyle={{color:"black"}}
                                    underlayColor="rgba(255,211,0,0.5)"
                                    disabled={this._getDisabled()}
                                    onPress={this._login.bind(this)}
                                    text={(this.state.loader ? 'Cargando...': 'Iniciar sesión')}
                                />
                            </View>

                            <View
                                style={style.pie}>
                                <Text 
                                    style={{fontSize:18,textAlign:"center",color:'#fff', textShadowOffset: { width: 1, height: 1 },textShadowRadius: 1,textShadowColor: 'rgba(0,0,0,0.5)',}}>
                                    ¿Olvidaste tus datos?
                                </Text>
                            </View>
                        </View>
                </ImageBackground>

            </ScrollView>

        )
    }
}

const style = StyleSheet.create({
    pagina: {
        width: '100%',
        height: '100%',
        backgroundColor: "#000"
    },
    contenedor:{
        width: '100%',
        height: '100%',
        position: 'relative',
        padding: 24,
        flex: 1,
        justifyContent: 'center',
    },
    input:{
        backgroundColor:"#fff",
        width:"100%",
        paddingHorizontal: 16,
        borderRadius: 50,
        fontFamily:"GoogleSans-Regular",
        fontSize:18,
        paddingVertical: 8
    },
    contenido: {
        position:'relative',
        padding: 16,
        maxWidth: 400,
        width: '100%',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 0,
        marginBottom:100,
        borderRadius:5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo:{
        fontFamily: "markerFelt",
        fontSize:48,
        marginBottom:56,
        color:"#fff",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 1,
        textShadowColor: 'rgba(0,0,0,0.5)'
    },
    pie:{
        position:'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        padding:24,
        flex: 1,
        alignItems: 'center',
        textAlign: 'center',
    }
})


export default Login