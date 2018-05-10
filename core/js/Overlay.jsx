import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

/**
 * The current overlay is kept within this file in order to ensure that only one can be shown.
 */
let layers = [];
let domNode;

export default class Overlay extends React.Component {
    static currentOverlay;

    componentWillMount() {
        this.keyup = this.keyup.bind( this );
        document.body.addEventListener( 'keyup', this.keyup );
    }

    componentWillUnmount() {
        document.body.removeEventListener( 'keyup', this.keyup );
    }

    render() {
        const layers = this.props.layers.map( layer => this.decomposeLayer( layer ) );
        const layer = layers[ layers.length - 1 ];

        const title = layers.map( layer => layer.title ).join( ' / ' );

        const body = React.cloneElement( layer.body, {
            ref: 'body'
        });

        return <div className="wp-core-ui uf-overlay">
            <div className="uf-overlay__background"></div>

            <div className="uf-overlay__box">
            	<header className="uf-overlay__header">
            		<h2 className="uf-overlay__title">{ title }</h2>

            		<button type="button" className="uf-overlay__close" onClick={ Overlay.remove }>
            			<span className="dashicons dashicons-no-alt"></span>
            			<span className="screen-reader-text">Close overlay</span>
            		</button>
            	</header>

            	<div className="uf-overlay__body">
                    { body }
                </div>

            	<footer className="uf-overlay__footer">
                    { layer.footer }
                </footer>
            </div>
        </div>
    }

    decomposeLayer( layer ) {
        const parts = {
            title:  null,
            footer: null,
            body:   null
        }

        // Allow for a single ignoreable root element
        const root = ( layer.type === Provider )
            ? React.Children.only( layer.props.children )
            : layer;

        // Detect particles
        React.Children.forEach( root.props.children, child => {
            switch( child.type ) {
                case Overlay.Title:
                    parts.title = child.props.children;
                    break;

                case Overlay.Footer:
                    parts.footer = child.props.children;
                    break;

                default:
                    parts.body = child;
            }
        });

        return parts;
    }

    canLayerBePopped() {
        if( 'function' == typeof this.refs.body.props.onLeave ) {
            const message = this.refs.body.props.onLeave();

            if( message && ! confirm( message ) ) {
                return false;
            }
        }

        return true;
    }

    keyup( e ) {
        if( 27 !== e.which || e.defaultPrevented ) {
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        if( this.canLayerBePopped() ) {
            Overlay.remove();
        }
    }

    static remove() {
        if( ! Overlay.currentOverlay.canLayerBePopped() ) {
            return;
        }

        layers.pop();

		const callback = Overlay.currentOverlay.refs.body.props.onRemove;
		if( 'function' == typeof callback ) {
			callback();
		}

        if( layers.length ) {
            Overlay.render();
        } else {
            ReactDOM.unmountComponentAtNode( domNode );
            domNode.parentNode.removeChild( domNode );
            domNode = null;
			document.body.classList.remove( 'uf-overlay-open' );
        }
    }

    static show( layer ) {
        layers.push( layer );
        Overlay.render();
    }

    static render() {
        if( ! domNode ) {
            domNode = document.createElement( 'div' );
            document.body.appendChild( domNode );
			document.body.classList.add( 'uf-overlay-open' );
        }

        ReactDOM.render(
			<Overlay layers={ layers } ref={ overlay => Overlay.currentOverlay = overlay } />,
			domNode
		);
    }
}

class Title extends React.Component {
    render() {
        return null;
    }
}

class Footer extends React.Component {
    render() {
        return null;
    }
}

Overlay.Title = Title;
Overlay.Footer = Footer;
