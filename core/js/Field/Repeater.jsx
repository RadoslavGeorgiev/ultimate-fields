import React from 'react';

import Field from './../Field.jsx';
import Button from './../Button.jsx';
import Group from './Repeater/Group.jsx';
import Prototype from './Repeater/Prototype.jsx';

export default class Repeater extends Field {
    static DEFAULT_GROUP_TYPE = 'entry';

    static strings = {
        noGroups: 'This field does not contain any groups.',
        addGenericGroup: 'Add entry'
    };

    /**
	 * Before rendering the component, all groups have to be loaded.
	 */
    componentWillMount() {
        this.groups = Repeater.getGroups( this );
 	}

    /**
     * Returns all groups, which belong to a specific field.
     *
     * @param {React.Element} field The field whose groups will be loaded.
     * @return {Array.Object}
     */
    static getGroups( field ) {
        const { children } = field.props;
 		const groups = [];

        // The generic group will receive immediate children which are not other groups
        const genericFields = [];

        // Distribute all child elements
 		React.Children.map( children, child => {
 			if( Group === child.type ) {
 				groups.push({ ...child.props });
 			} else {
 				genericFields.push( child );
 			}
 		});

        // Add the default group to the mix if needed
        if( genericFields.length ) {
            groups.unshift({
                type:     Repeater.DEFAULT_GROUP_TYPE,
    			title:    'Entry',
                children: genericFields
            });
        }

        return groups;
    }

    /**
     * Renders the top-level input of the Repeater field.
     *
     * @return {React.Element}
     */
    renderInput() {
        const { noGroups } = Repeater.strings;
        const { chooser_type } = this.props;
        const groups = this.groups;

        // If there are no groups, nothing will be displayed
        if( ! groups.length ) {
            return <p>{ noGroups }</p>
        }

        else if( 1 === groups.length ) {
            return this.renderSingleGroup( groups[0] );
        }

        // Multiple groups mode

        else if( 'dropdown' === chooser_type ) {

        }

        else if( 'tags' === chooser_type ) {

        }

        else {
            return this.renderMultipleGroups( groups );
        }
    }

    /**
     * Renders the layout for when a single group type is present.
     *
     * @param  {Object} group The group to use.
     * @return {React.Element}
     */
    renderSingleGroup( group ) {
        const { addGenericGroup } = Repeater.strings;
        const { type } = group;

        // Prepare the add group button
        const button = react.createElement( Button, {
            children: addGenericGroup,
            icon:     'dashicons-plus',
            onClick:  () => this.addGroup( type )
        });

        // Output the structure
        const entries = this.renderEntries();

        if( 0 === entries.length ) {
            return button;
        }

        return <div className="uf-repeater">
            <div className="uf-repeater__groups" ref="groups">{ entries }</div>
            { button }
        </div>
    }

    /**
     * Renders the skeleton of the field when multiple groups are available.
     *
     * @param  {Array.Object} groups Basic definitions of all groups.
     * @return {React.Element}
     */
    renderMultipleGroups( groups ) {
        const { placeholder_text } = this.props;
        const entries = this.renderEntries();

        const prototypes = groups.map( group => {
            const { type, title, description } = group;

            return React.createElement( Prototype, {
                key: type,
                title,
                description,
                type,

                onClick: () => this.addGroup( type )
            });
        });

        const groupsClass = [ 'uf-repeater__groups' ];
        if( ! entries.length ) groupsClass.push( 'uf-repeater__groups--empty' );

        return <div className="uf-repeater">
            <div className={ groupsClass.join( ' ' ) } ref="groups">
                { entries.length
                    ? entries
                    : <div className="uf-repeater__placeholder">
                        { placeholder_text }
                    </div> }
            </div>
            <div className="uf-repeater__prototypes" ref="prototypes">{ prototypes }</div>
        </div>
    }

    /**
     * Renders all existing entries.
     *
     * @return {Array.React.Element}
     */
    renderEntries() {
        const {
            source, name,
            getValueFromContext, onDelete, onToggle, onClone
        } = this.props;

        return this.getValue().map( ( row, i ) => {
            const { index, hidden, type } = row;

            const group = this.groups.find( group => group.type === type );

            return React.createElement( Group, {
                ...group,

                key:     index,
                source: `${source}_${name}_${index}`,
                position: i + 1,
                index:    index,
                hidden:   hidden,

                onDelete: () => onDelete( name, source, index ),
                onToggle: () => onToggle( name, source, index ),
                onClone:  () => onClone( name, source, index, group ),

                getValueFromContext

                // onEditFullScreen
            });
        })
    }

    /**
     * Once the entries have been rendered, start jQuery UI's sortable.
     */
    componentDidMount() {
        const { chooser_type } = this.props;
        const { groups, prototypes } = this.refs;

        const $sortable = jQuery( groups ).sortable({
            axis:   'y',
			handle: '.uf-group__header',
			stop:   this.saveSort.bind( this ),
			forcePlaceholderSize: true
        });

        // In widgets mode, allow prototypes to be dragged
        if( 'widgets' != chooser_type || ! Repeater.getGroups( this ).length ) {
            return;
        }

        var $prototypes = jQuery( prototypes ).find( '.uf-group' );

		$prototypes.draggable({
			connectToSortable: $sortable,
			helper: 'clone',
			revert: 'invalid',
			containment: $sortable.closest( '.uf-field__inputs' ),
			start: function( e, ui ) {
				ui.helper.addClass( 'uf-group--dragging' );
			},
			stop: function( e, ui ) {
				// setTimeout(function() {
				// 	ui.helper.removeClass( 'uf-group--dragging' );
				// }, 30 );
                ui.helper.remove();
			}
		});
    }

    /**
     * Saves the order of the groups once they have been rendered.
     */
    saveSort() {
        const { name, source, populatePlaceholders } = this.props;
        const existing = this.getValue();
        let populate = false;

        const value = Array.from( this.refs.groups.children ).map( child => {
            if( 'type' in child.dataset ) {
                populate = true;

                // An item was dropped
                return {
                    index:  null,
                    type:   child.dataset.type,
                    hidden: false
                }
            } else {
                const index = parseInt( child.dataset.index );
                return existing.find( group => index === group.index );
            }
        });

        if( populate ) {
            populatePlaceholders( name, source, value, Repeater.getGroups( this ) );
        } else {
            this.updateValue( value );
        }
    }

    /**
     * Adds a new group to the list of entries.
     */
    addGroup( type ) {
        const { name, value, source, addRow } = this.props;
        const group = this.groups.find( group => group.type === type );

        addRow( name, source, group );
    }
}
