import React from 'react';

export default class Prototype extends React.Component {
    render() {
        const { type, title, description, onClick } = this.props;

        return <div className="uf-prototype">
            <div className="uf-group uf-prototype__group" data-type={ type }>
                <div className="uf-group__header uf-prototype__header" onClick={ onClick }>
                    <div className="uf-group__number">
                        <em className="dashicons dashicons-plus"></em>
                    </div>

                    <h3 className="uf-group__title">{ title }</h3>
                </div>
            </div>

            { description && <div className="uf-prototype__description" dangerouslySetInnerHTML={{ __html: description }} /> }
        </div>
    }
}
