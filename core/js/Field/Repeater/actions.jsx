import StoreParser from './../../StoreParser.js';

export function addRow( field, source, group ) {
    return {
        type: 'ADD_REPEATER_GROUP',
        field, source, group
    };
}

export function onDelete( field, source, index ) {
    return {
        type: 'DELETE_REPEATER_GROUP',
        field, source, index
    }
}

export function onToggle( field, source, index ) {
    return {
        type: 'TOGGLE_REPEATER_GROUP',
        field, source, index
    }
}

export function onClone( field, source, index, group ) {
    return {
        type: 'CLONE_REPEATER_GROUP',
        field, source, index, group
    }
}

export function populatePlaceholders( field, source, value, groups ) {
    return {
        type: 'POPULATE_REPEATER_PLACEHOLDERS',
        field, source, value, groups
    }
}
