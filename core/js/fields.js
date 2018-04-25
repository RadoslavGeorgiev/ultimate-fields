import Field from './Field.jsx';
import Text from './Field/Text.jsx';
import Textarea from './Field/Textarea.jsx';
import Checkbox from './Field/Checkbox.jsx';
import Select from './Field/Select.jsx';
import Repeater from './Field/Repeater.jsx';

export default function getFieldType( field ) {
	let fieldClass;

	if( field.type !== Field ) {
		return field.type;
	}

	switch( field.props.type ) {
		case 'textarea': fieldClass = Textarea; break;
		case 'repeater': fieldClass = Repeater; break;
		case 'checkbox': fieldClass = Checkbox; break;
		case 'select':   fieldClass = Select; break;
		default:         fieldClass = Text;
	}

	return fieldClass;
}
