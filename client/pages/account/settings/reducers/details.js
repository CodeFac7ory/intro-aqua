'use strict';
const Constants = require('../constants');
const ObjectAssign = require('object-assign');
const ParseValidation = require('../../../../helpers/parse-validation');


const initialState = {
    hydrated: false,
    loading: false,
    showSaveSuccess: false,
    error: undefined,
    hasError: {},
    help: {},
    name: {
        first: '',
        middle: '',
        last: ''
    },
    title: '',
    organization: '',
    phone: '',
    website: '',
};
const reducer = function (state = initialState, action) {

    if (action.type === Constants.GET_DETAILS) {
        return ObjectAssign({}, state, {
            loading: true,
            hydrated: false
        });
    }

    if (action.type === Constants.GET_DETAILS_RESPONSE) {
        const validation = ParseValidation(action.response);

        return ObjectAssign({}, state, {
            loading: false,
            hydrated: true,
            error: validation.error,
            hasError: validation.hasError,
            help: validation.help,
            name: action.response.name,
            title: action.response.title,
            organization: action.response.organization,
            phone: action.response.phone,
            website: action.response.website,
        });
    }

    if (action.type === Constants.SAVE_DETAILS) {


        console.log('------------action.request');
        console.log(action.request);
        return ObjectAssign({}, state, {
            loading: true,
            name: action.request.data.name
        });
    }

    if (action.type === Constants.SAVE_DETAILS_RESPONSE) {
        const validation = ParseValidation(action.response);
        const stateUpdates = {
            loading: false,
            showSaveSuccess: !action.err,
            error: validation.error,
            hasError: validation.hasError,
            help: validation.help
        };

        if (action.response.hasOwnProperty('name')) {
            stateUpdates.name = action.response.name;
        }

        return ObjectAssign({}, state, stateUpdates);
    }


    if (action.type === Constants.SAVE_PROFILE_PICTURE) {

        console.log('------------action.request');
        console.log(action.request);

        return ObjectAssign({}, state, {
            loading: true,
            profilePicture: action.request.data.profilePicture
        });
    }

    if (action.type === Constants.SAVE_PROFILE_PICTURE_RESPONSE) {

        console.log('-------action.response');
        console.log(action.response);

        const validation = ParseValidation(action.response);
        const stateUpdates = {
            loading: false,
            showSaveSuccess: !action.err,
            error: validation.error,
            hasError: validation.hasError,
            help: validation.help
        };

        if (action.response.hasOwnProperty('name')) {
            stateUpdates.name = action.response.name;
        }

        return ObjectAssign({}, state, stateUpdates);
    }

    if (action.type === Constants.HIDE_DETAILS_SAVE_SUCCESS) {
        return ObjectAssign({}, state, {
            showSaveSuccess: false
        });
    }

    return state;
};


module.exports = reducer;
