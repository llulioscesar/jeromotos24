import {createAppContainer, createStackNavigator} from 'react-navigation'

import Login from './screens/Login'
import Cliente from './screens/Cliente'

const AppNavigator = createStackNavigator({
    home:{
        screen: Login
    },
    cliente:{
        screen: Cliente
    }
},{
    headerMode:'none',
})

export default createAppContainer(AppNavigator)