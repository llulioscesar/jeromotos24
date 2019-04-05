import React, {Component} from 'react'
import {StyleSheet, View, Text, TouchableHighlight} from 'react-native'

class Boton extends Component{

    static defaultProps = {
        textStyle: {},
        disabled: false,
        underlayColor: "rgba(9,193,129,0.6)"
    }

    onPress(){
        if (this.props.onPress){
            this.props.onPress()
        }
    }

    _hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    _rgbToHex(r,g,b) {
        let color = rgb.substring(4, rgb.length-1).replace(/ /g, '').split(',');
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    _getBackground(){
        let prop = { backgroundColor: '#09c181' }
        if(this.props.color){
            prop = { backgroundColor : this.props.color }
        }
        if(this.props.disabled){
            if(this.props.color){
                if (this.props.color.substring(0,1) == "#"){
                    let color = this._hexToRgb(this.props.color)
                    prop = {backgroundColor: "rgba("+color.r+ ","+color.g+","+ color.b+", 0.75)"}
                }else{
                    rgb = this.props.color
                    rgb = rgb.substring(4, rgb.length-1)
                    .replace(/ /g, '')
                    .split(',');
                    prop = {backgroundColor: "rgba("+rgb[0]+","+rgb[1]+","+rgb[2]+",0.75)"}
                }
            }else {
                prop = { backgroundColor: 'rgba(9,193,129,0.75)' } 
            } 
        }
        return prop
    }

    render() {
        return (
            <TouchableHighlight
                activeOpacity={1}
                disabled={this.props.disabled}
                underlayColor={this.props.underlayColor}
                onPress={this.onPress.bind(this)}
                style={[style.boton, this._getBackground(), this.props.style]}>
                <Text style={[style.text, this.props.textStyle]}>{this.props.text}</Text>
            </TouchableHighlight>
        )
    }
}

const style = StyleSheet.create({
    boton:{
        width : '100%',
        height : 42,
        flexDirection : 'row',
        alignItems : 'center',
        justifyContent : 'center',
        borderRadius : 3	
    },
    text:{
        color : 'white',
        fontSize: 16,
        fontFamily: "GoogleSans-Medium"
    }
}) 

export default Boton
