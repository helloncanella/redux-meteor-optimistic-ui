import React, { Component, PropTypes } from 'react'
import { StyleSheet, Text, View, Button } from 'react-native'
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk';
import Meteor, { ddp } from 'react-native-meteor';

Meteor.connect('ws://192.168.1.18:3000/websocket')

const reducers = combineReducers({ collections, entriesToSaveOnDB })
const store = createStore(reducers, applyMiddleware(thunk))

ddp.on('connected', () => {
    //TODO: verify if there are connected 
})

ddp.on("added", dbItem => {
    const { provisoryId, id: newId } = dbItem

    if (provisoryId) store.dispatch(replaceProvisoryId(provisoryId, newId))
    else store.dispatch(add(dbItem))
});



function collections(state = {}, action) {

    const add = (state, dbItem) => {
        let { collection, fields, id, provisoryId } = dbItem

        id = id || provisoryId

        if (!state[collection]) {
            state[collection] = {};
            return {
                ...state,
                [collection]: {
                    [id]: fields,
                },
            };
        } else if (!state[collection][id]) {
            return {
                ...state,
                [collection]: {
                    ...state[collection],
                    [id]: fields,
                },
            }
        } else {
            return {
                ...state,
                [collection]: {
                    ...state[collection],
                    [id]: { ...fields, ...state[collection][id] },
                }
            };
        }

    }

    function replaceId(state, action) {
        const { provisoryId, newId, collection } = action


        const collectionState = state[collection]

        const item = newCollectionState[provisoryId]



        



        return Object.assign({}, state, {[action.collection]: newCollectionState})





        return Object.assign({}, whithouOldId, { [newId]: value });
    }

    switch (action.type) {
        case ADD:
            return add(state, action.dbItem);
        case REPLACE_PROVISORY_ID:
            return replaceId(state[action.collection], action)
        // case UPDATE:
        default:
            return state
    }
}


function entriesToSaveOnDB(state = {}, action) {

    const schedule = entry => state[entry.provisoryId] = entry

    switch (action.type) {
        case SCHEDULE_DATA_SAVING:
            return schedule(entry)
        default:
            return state
    }

}



const ADD = 'add'
const SCHEDULE_DATA_SAVING = 'schedule-data-saving'
const REPLACE_PROVISORY_ID = 'replace-provisory-id'

function add(dbItem) {
    return {
        type: ADD,
        dbItem
    }
}

function saveOnDBConnected(entry) {
    return {
        type: SCHEDULE_DATA_SAVING,
        entry
    }
}


function saveToDB(method, payload) {
    if (Meteor.status().connected) {
        Meteor.call(method, payload)
    } else {
        dispatch(saveOnDBConnected({ method, payload }))
    }
}

function replaceProvisoryId(provisoryId, newId) {
    return {
        type: REPLACE_PROVISORY_ID,
        provisoryId,
        newId
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
        links: state.collection.links,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        addLink: (link) => {

            const payload = {
                provisoryId: Math.random(),
                collection: 'links',
                fields: {
                    url: link,
                }
            }

            const saveToDB = () => dispatch(saveToDB('links.insert', payload))

            dispatch(add(payload)).then(saveToDB)
        }
    }
}


function Goias(props) {

    const container = { flex: 1, justifyContent: 'center', alignItems: 'center' }
        , { links, onClick } = props

    return (

        <View style={container}>
            {links.forEach(({ id, fields }) => {
                <Text style={{ fontSize: 25, marginBottom: 30 }}>{props.payload}</Text>
            })}

            <Input />
            <Button
                onPress={props.addLink}
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







