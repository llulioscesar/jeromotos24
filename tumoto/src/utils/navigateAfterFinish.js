import {NavigationActions, StackActions} from 'react-navigation'

navigationAfterFinish = (screen, props) => {
    const resetAction = StackActions.reset({
        index:0,
        key:null,
        actions:[ NavigationActions.navigate({routeName: screen})],
    })
    props.navigation.dispatch(resetAction)
}

export default navigationAfterFinish
