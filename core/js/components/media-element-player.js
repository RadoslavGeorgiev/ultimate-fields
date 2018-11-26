/**
 * External dependencies
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * Handles the rendering of video and audio components.
 * 
 * By wrapping video and audio elements within a wrapper,
 * this will allow for easy and proper cleanup before
 * player changes.
 */
export default class MediaElementPlayer extends Component {
    static propTypes = {
        children: PropTypes.node,
        ids: PropTypes.arrayOf( PropTypes.number ),
    }

    render() {
        const { ids, children } = this.props;

        return <div className="uf-media-player" ref="wrapper">
            {
                React.Children.map( children, child => {
                    return React.cloneElement( child, {
                        key: ids.join( '-' ),
                        ref: 'player',
                    } );
                } )
            }
        </div>
    }

    /**
     * Starts the player once the component gets mounted.
     */
    componentDidMount() {
        const { player } = this.refs;
        jQuery( player ).mediaelementplayer();
    }

    /**
     * Moves the node back to the root and cleans up after the player.
     */
    componentWillUpdate() {
        const { wrapper, player } = this.refs;

        player.parentNode.removeChild( player );
        wrapper.innerHTML = '';
        wrapper.appendChild( player );
    }

    /**
     * Restars the player after updates.
     */
    componentDidUpdate() {
        this.componentDidMount();
    }
}