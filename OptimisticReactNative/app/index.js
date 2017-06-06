import React, { Component, PropTypes } from 'react'
import { StyleSheet, Text, View, Button, TextInput, ScrollView } from 'react-native'
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk';
import Meteor, { ddp } from 'react-native-meteor';
import _ from 'lodash';

Meteor.connect('ws://192.168.1.18:3000/websocket')

const reducers = combineReducers({ collections, entriesToSaveOnDB })
const store = createStore(reducers, applyMiddleware(thunk))




ddp.on('connected', () => {
    //TODO: verify if there are connected 

    console.log(store.getState())


    Meteor.subscribe('links.all')

})

ddp.on("added", dbItem => {
    // const { provisoryId, id: newId, collection } = dbItem

    // if (provisoryId) store.dispatch(replaceProvisoryId({ provisoryId, newId, collection }))
    // else store.dispatch(add(dbItem))

    store.dispatch(add(dbItem))
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

    // function replaceId(state, action) {
    //     const { provisoryId, newId, collection } = action

    //     const collectionState = state[collection]

    //     const provisoryIdValue = collectionState[provisoryId]

    //     const whithouOldId = Object.keys(collectionState).reduce((result, id) => {
    //         if (id !== provisoryId) result[id] = state[id]
    //     }, {})

    //     const newCollectionState = Object.assign({}, whithouOldId, { [newId]: provisoryOldValue })

    //     return Object.assign({}, state, { [action.collection]: newCollectionState })

    // }

    switch (action.type) {
        case ADD:
            return add(state, action.dbItem);
        case REPLACE_PROVISORY_ID:
            return replaceId(state, action)
        // case UPDATE:
        default:
            return state
    }
}


function entriesToSaveOnDB(state = {}, action) {

    const schedule = entry => {
        return { ...state, [entry.provisoryId]: entry }
    }

    switch (action.type) {
        case SCHEDULE_DATA_SAVING:
            return schedule(action.entry)
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

    return dispatch => {
        if (Meteor.status().connected) {
            Meteor.call(method, payload)
        } else {
            dispatch(saveOnDBConnected({ method, payload }))
        }
    }

}



// function replaceProvisoryId({ provisoryId, newId, collection }) {
//     return {
//         type: REPLACE_PROVISORY_ID,
//         provisoryId,
//         newId,
//         collection
//     }
// }


export default class App extends Component {
    render() {
        return <Wrap />
    }
}


import { connect } from 'react-redux'


const getCollection = (state, collection) => {
    let items = state.collections && state.collections[collection] || {}

    //converting object collection to array 
    return _.transform(items, (result, value) => {
        result.push(value)
        return result
    }, [])

}

const mapStateToProps = (state, ownProps) => {
    return {
        links: getCollection(state, 'links')
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        addLink: (link) => {
            const fields = { url: link }

            const payload = {
                provisoryId: Math.random(),
                collection: 'links',
                fields
            }

            dispatch(add(payload))
            dispatch(saveToDB('links.insert', fields))

        }
    }
}


class Goias extends Component {

    constructor() {
        super()
        this.state = {
            link: ''
        }
    }

    render() {

        const container = { flex: 1, justifyContent: 'center', alignItems: 'center' }
            , { links, onClick } = this.props

        return (

            <ScrollView>
                <View style={container}>
                    {
                        links.map((link, index) => {
                            return <Text key={`link-${index}`} style={{ fontSize: 12, marginBottom: 10 }}>{link.url}</Text>
                        })
                    }

                    <TextInput value={this.state.link} style={{ width: 200 }} onChangeText={value => this.setState({ link: value })} />
                    <Button
                        onPress={() => this.props.addLink(this.state.link)}
                        title="Learn More"
                        color="teal"
                        accessibilityLabel="Learn more about this purple button"
                    />

                </View>
            </ScrollView>
        )
    }

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







