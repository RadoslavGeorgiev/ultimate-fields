import React from 'react';
import Item from './Item.jsx';

export default class ObjectsItem extends React.Component {
    render() {
        const { item, onRemove } = this.props;

        return <div className="uf-objects__item" data-id={ item.id }>
            <div className="uf-objects__handle">
                <span className="dashicons dashicons-menu"></span>
            </div>

            <div className="uf-object-preview uf-objects-item-wrapper">
                <Item { ...item } />
            </div>

            <button className="uf-objects__remove" type="button" onClick={ onRemove }>
                <span className="dashicons dashicons-no"></span>
            </button>
        </div>
    }
}
