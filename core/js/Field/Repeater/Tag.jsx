import React from 'react';

export default class Tag extends React.Component {
    render() {
        const { title, disabled } = this.props;

        const cssClass = [
            'uf-tags__tag',
            disabled ? 'uf-tags__tag--disabled' : ''
        ].filter( name => !! name ).join( ' ' );

        const onClick = e => {
            e.preventDefault();
            this.props.onClick();
        }

        return <a href="#" className={ cssClass } title="Click to add" onClick={ onClick }>{ title }</a>
    }
}
