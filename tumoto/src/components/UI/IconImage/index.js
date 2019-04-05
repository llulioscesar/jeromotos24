import React,{Component} from 'react'
import {Image} from 'react-native'

type Props = {
    name: string,
    size: Object,
    style: Object,
    color: string,
    fillAll: bool,
}

class IconImage extends Component<Props>{

    static defaultProps = {
        size: {
            width: 24,
            height: 24
        },
        style:{},
        color: undefined,
        fillAll: false,
    }

    render(){
        const {name, size, style, color, fillAll} = this.props

        let icon = null
        switch(name){
            case 'info':
                icon = require('../../../../assets/iconos/info.png')
                break
            case 'info-color':
                icon = require('../../../../assets/iconos/info-color.png')
                break
            case 'engine':
                icon = require('../../../../assets/iconos/engine.png')
                break
            case 'engine-color':
                icon = require('../../../../assets/iconos/engine-color.png')
                break
            case 'bell':
                icon = require('../../../../assets/iconos/bell.png')
                break
            case 'bell-color':
                icon = require('../../../../assets/iconos/bell-color.png')
                break
            case 'improve':
                icon = require('../../../../assets/iconos/improve.png')
                break
            case 'improve-color':
                icon = require('../../../../assets/iconos/improve-color.png')
                break
        }

        return (
            <Image
                style={[style, size]}
                source={icon}
            />
        )
    }
}

export default IconImage
