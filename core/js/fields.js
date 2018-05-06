import Field from './Field.jsx';
import Text from './Field/Text.jsx';
import Textarea from './Field/Textarea.jsx';
import Checkbox from './Field/Checkbox.jsx';
import Select from './Field/Select.jsx';
import Multiselect from './Field/Multiselect.jsx';
import File from './Field/File.jsx';
import Image from './Field/Image.jsx';
import WP_Object from './Field/WP_Object.jsx';
import Repeater from './Field/Repeater.jsx';
import Complex from './Field/Complex.jsx';

export default function getFieldType( field ) {
	let fieldClass;

	if( field.type !== Field ) {
		return field.type;
	}

	switch( field.props.type.toLowerCase() ) {
		case 'repeater':    fieldClass = Repeater; break;
		case 'complex':     fieldClass = Complex; break;
		case 'textarea':    fieldClass = Textarea; break;
		case 'checkbox':    fieldClass = Checkbox; break;
		case 'select':      fieldClass = Select; break;
		case 'multiselect': fieldClass = Multiselect; break;
		case 'file':        fieldClass = File; break;
		case 'image':       fieldClass = Image; break;
		case 'wp_object':   fieldClass = WP_Object; break;
		case 'text':        fieldClass = Text; break;
		default:         {
			console.warn( 'Unknown field type: ' + field.props.type );
			fieldClass = Text;
		}
	}

	return fieldClass;
}
