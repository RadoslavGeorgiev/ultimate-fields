import React from 'react';
import _ from 'lodash';

import Field from './../Field.jsx';
import Button from './../Button.jsx';
import Group from './Repeater/Group.jsx';
import Prototype from './Repeater/Prototype.jsx';
import Tag from './Repeater/Tag.jsx';
import repeaterValidator from './Repeater/validator.js';
import FullScreenController from './Repeater/FullScreenController.jsx';

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
            return this.renderDropdown( groups );
        }

        else if( 'tags' === chooser_type ) {
            return this.renderTags( groups );
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
        const limits  = this.getLimits();

        const prototypes = groups.map( group => {
            const { type, title, description } = group;

            return React.createElement( Prototype, {
                key: type,
                title,
                description,
                type,
                disabled: limits.groups[ type ],

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
     * Renders the skeleton of the field when multiple groups are available as tags.
     *
     * @param  {Array.Object} groups Basic definitions of all groups.
     * @return {React.Element}
     */
    renderTags( groups ) {
        const { add_text: text } = this.props;
        const entries = this.renderEntries();
        const limits  = this.getLimits();

        const tags = groups.map( group => {
            const { type, title, description } = group;

            return React.createElement( Tag, {
                key: type,
                title,
                description,
                type,
                disabled: limits.groups[ type ],

                onClick: () => this.addGroup( type )
            });
        });

        return <div className="uf-repeater">
            <div className="uf-repeater__groups" ref="groups">{ entries }</div>
            <div className="uf-tags">
            	<h4 className="uf-tags__text">{ text }</h4>
            	<div className="uf-tags__options">{ tags }</div>
            </div>
        </div>
    }

    /**
     * Renders the skeleton of the field when multiple groups are available as a dropdown.
     *
     * @param  {Array.Object} groups Basic definitions of all groups.
     * @return {React.Element}
     */
    renderDropdown( groups ) {
        const { add_text: text } = this.props;

        const entries = this.renderEntries();

        const options = groups.map( group => {
            const { type, title } = group;

            let disabled = false;

            if( ! disabled ) {
                return <option value={ group.type } key={ group.type }>{ title }</option>;
            }
        });

        // The callback to add a new group
        const addGroup = () => this.addGroup( this.refs.dropdownSelect.value );

        return <div className="uf-repeater">
            <div className="uf-repeater__groups" ref="groups">{ entries }</div>

            <div className="uf-repeater__dropdown">
            	<select ref="dropdownSelect">{ options }</select>
                <Button icon="dashicons-plus" onClick={ addGroup }>{ text }</Button>
            </div>
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
            getGroupErrors, getValueFromContext, onDelete, onToggle, onClone
        } = this.props;

        const limits = this.getLimits();

        return this.getValue().map( ( row, i ) => {
            const { index, hidden, type } = row;

            const group       = this.groups.find( group => group.type === type );
            const groupSource = `${source}_${name}_${index}`;

            return React.createElement( Group, {
                ...group,

                key:     index,
                source:  groupSource,
                position: i + 1,
                index:    index,
                hidden:   hidden,
                invalid:  getGroupErrors( groupSource ).length > 0,

                canBeDeleted: ! limits.min,
                canBeCloned:  ! limits.max && ! limits.groups[ type ],

                onDelete:         () => onDelete( name, source, index ),
                onToggle:         () => onToggle( name, source, index ),
                onClone:          () => onClone( name, source, index, group ),
                onEditFullScreen: () => this.openFullScreen( row ),

                getValueFromContext

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
                ui.helper.remove();
			}
		});

        this.componentDidUpdate();
    }

    componentDidUpdate() {
        const limits = this.getLimits();

        jQuery( this.refs.prototypes ).children().each(function() {
            if( this.classList.contains( 'uf-prototype--disabled' ) ) {
                jQuery( this.children[0] ).draggable( 'disable' );
            } else {
                jQuery( this.children[0] ).draggable( 'enable' );
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
        const group  = this.groups.find( group => group.type === type );
        const limits = this.getLimits();

        if( limits.groups[ type ] ) {
            return;
        }

        addRow( name, source, group );
    }

    /**
     * Returns the limits for minimum and maximum of the whole field, as well as individual groups.
     */
    getLimits() {
        const { maximum, minimum } = this.props;

        const limits = {
            min:    false,
            max:    false,
            groups: {}
        }

        const usedGroups = {};
        const entries = this.getValue();

        entries.forEach( entry => {
            usedGroups[ entry.type ] = usedGroups[ entry.type ] || 0;
            usedGroups[ entry.type ]++;
        });

        // Calculate
        if( minimum && entries.length <= minimum ) {
            limits.min = true;
        }

        if( maximum && entries.length >= maximum ) {
            limits.max = true;
        }

        _.forEach( usedGroups, ( count, type ) => {
			if( limits.max ) {
				return limits.groups[ type ] = true;
			}

            const group = this.groups.find( group => group.type === type );

            if( group.maximum && group.maximum <= usedGroups[ type ] ) {
                limits.groups[ type ] = true;
            } else {
                limits.groups[ type ] = false;
            }
        });

        return limits;
    }

    /**
     * Opens a group in full screen.
     *
     * @param {Object} row The row, which the group is associated with.
     */
    openFullScreen( row ) {
		new FullScreenController( row, this.props, this.groups );
    }

    /**
     * Returns a validator for the field.
     */
    static getValidator() {
        return repeaterValidator;
    }

    /**
     * Returns the default value of the field.
     *
     * @return {Array}
     */
    static getDefaultValue() {
        return [];
    }
}
