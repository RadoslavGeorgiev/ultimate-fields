import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Button from './Button.jsx';

/**
 * The current overlay is kept within this file in order to ensure that only one can be shown.
 */
let layers = [];
let domNode;

export default class Overlay extends React.Component {
    static currentOverlay;

	state = {
		alert: null
	}

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

        let title = layers.map( layer => layer.title.text ).join( ' / ' );
        if( layer.title.icon ) {
            title = <React.Fragment>
                <span className={ 'dashicons ' + layer.title.icon } />
                { title }
            </React.Fragment>
        }

        const body = React.cloneElement( layer.body, {
            ref: 'body'
        });

		const alert = this.state.alert
			? React.cloneElement( this.state.alert, {
				onClose: () => {
					this.setState({ alert: null })
				}
			})
			: null;

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

				{ alert }
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
                    parts.title = {
                        icon: child.props.icon,
                        text: child.props.children
                    };
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
            return false;
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

        return true;
    }

    static show( layer ) {
		if( layer.type === Alert ) {
			Overlay.currentOverlay.setState({
				alert: layer
			});
		} else {
			layers.push( layer );
			Overlay.render();
		}
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

class Alert extends React.Component {
	static defaultProps = {
		title: 'Alert'
	}

	render() {
		const { title, children } = this.props;

		return <div className="uf-confirmation" ref="body">
			<div className="uf-confirmation__background"></div>

			<div className="uf-confirmation__box">
				<h2 className="uf-confirmation__title">{ title }</h2>

				<div className="uf-confirmation__body">
					{ children }
				</div>

				<div className="uf-confirmation__footer">
					<Button onClick={ this.close.bind( this ) }>OK</Button>
				</div>
			</div>
		</div>
	}

	componentDidMount() {
		this.refs.body.classList.add( 'uf-confirmation--visible' );
	}

	close() {
		const { body } = this.refs;
		const { onClose } = this.props;

		body.classList.remove( 'uf-confirmation--visible' );
		setTimeout( onClose, 300 );
	}
}

Overlay.Title        = Title;
Overlay.Footer       = Footer;
Overlay.Alert = Alert;
