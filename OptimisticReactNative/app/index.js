import React, { Component, PropTypes } from 'react'
import { StyleSheet, Text, View, Button } from 'react-native'
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk';

const reducers = combineReducers({ payload: reducerOk, payload1: reducerOk2 })

const store = createStore(reducers, applyMiddleware(thunk))

function reducerOk(state = 0, action) {

    switch (action.type) {
        case ANY_ACTION:
            return state + 1;
        default:
            return state
    }

}



function reducerOk2(state = 0, action) {

    switch (action.type) {
        case ANY_ACTION_1:
            return state + action.payload1;
        default:
            return state
    }

}

const ANY_ACTION = 'any-action'
const ANY_ACTION_1 = 'any-action-1'

function myAction() {
    return {
        type: ANY_ACTION,
        payload: 1
    }
}

function myAction1() {
    return {
        type: ANY_ACTION_1,
        payload1: 2
    }
}

function testThunk() {
    return dispatch => {
        setTimeout(() => dispatch(myAction()), 1000)
    }
}



export default class App extends Component {
    render() {


        return <Wrap />


    }
}


import { connect } from 'react-redux'

const mapStateToProps = (state, ownProps) => {
    return {
        payload: state.payload,
        payload1: state.payload1
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onClick: () => {
            dispatch(myAction())
        },
        onClick1: () => {
            dispatch(testThunk())
        }
    }
}


function Goias(props) {

    const container = { flex: 1, justifyContent: 'center', alignItems: 'center' }

    return (

        <View style={container}>
            <Text style={{ fontSize: 50, marginBottom: 30 }}>{props.payload}</Text>
            <Button
                onPress={props.onClick}
                title="Learn More"
                color="#841584"
                accessibilityLabel="Learn more about this purple button"
            />

            <Text style={{ fontSize: 50, marginBottom: 30, marginTop: 40 }}>{props.payload1}</Text>
            <Button
                onPress={props.onClick1}
                title="Learn More"
                color="teal"
                accessibilityLabel="Learn more about this purple button"
            />
        </View>
    )
}


const GoiasContainer = connect(mapStateToProps, mapDispatchToProps)(Goias)




class Wrap extends Component {

    render() {
        return (
            <Provider store={store}>
                <GoiasContainer />
            </Provider>
        )
    }

}







