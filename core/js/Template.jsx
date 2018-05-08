import React from 'react';
import _ from 'lodash';

export default class Template extends React.Component {
    static defaultProps = {
        tagName:  'div',
        className: null
    }

    render() {
        const name = this.props.name.replace( /\//g, '-' );
        let html = document.getElementById( 'ultimate-fields-' + name ).innerHTML;

        _.forEach( this.props, ( value, key ) => {
            const regex = new RegExp( '<%= ' + key + ' %>', 'g' );
            html = html.replace( regex, value );
        });

        let tagName   = this.props.tagName;
        const attr = {
            ref: 'template',
            className: this.props.className,
            dangerouslySetInnerHTML: {
                __html: html
            }
        }

        if( 'loadTagFromTemplate' in this.props ) {
            const matches = html.trim().match( /^<(\w+)([^>]*)>/ );
            const attrRegex = '([\\w-]+)="([^"]*)"';

            if( matches ) {
                // Overwrite the tag name
                tagName = matches[1];

                // Extract attributes
                if( matches[2] ) {
                    matches[2].match( new RegExp( attrRegex, 'g' ) ).forEach( raw => {
                        let [ match, name, value ] = raw.match( attrRegex );
                        name = name.replace( 'class', 'className' );
                        attr[ name ] = value;
                    });
                }

                // Remove the tag from the HTML
                attr.dangerouslySetInnerHTML.__html = html
                    .replace( new RegExp( '^<' + tagName + '[^>]*>' ), '' )
                    .replace( new RegExp( '</' + tagName + '>$' ), '' );
            }
        }

        return React.createElement( tagName, attr );
    }

    componentDidMount() {
        const { componentDidMount } = this.props;

        if( componentDidMount ) {
            componentDidMount( this.refs.template );
        }
    }
}
