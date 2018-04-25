export const updateValue   = ( name, value, context ) => ({ type: 'UPDATE_VALUE', name, value, context })

export const createContext = ( name, data )  => ({ type: 'CREATE_CONTEXT', name, data })
export const destroyContext = ( name ) => ({ type: 'DESTROY_CONTEXT', name });

export const addRepeaterRow    = ( name, index ) => ({ type: 'ADD_REPEATER_ROW', name, index })
export const deleteRepeaterRow = ( name, index ) => ({ type: 'DELETE_REPEATER_ROW', name, index });

export const cloneContext        = ( from, to, changes ) => ({ type: 'CLONE_CONTEXT', from, to, changes });
export const updateRepeaterOrder = ( name, order )       => ({ type: 'UPDATE_REPEATER_ORDER', name, order });
export const replaceContexts     = contexts              => ({ type: 'REPLACE_CONTEXTS', contexts });
export const toggleRepeaterGroup = ( name )              => ({ type: 'TOGGLE_REPEATER_GROUP', name });
