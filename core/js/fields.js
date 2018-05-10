import Field from './Field.jsx';
import Section from './Field/Section.jsx';
import Message from './Field/Message.jsx';

import Text from './Field/Text.jsx';
import Password from './Field/Password.jsx';
import Textarea from './Field/Textarea.jsx';
import WYSIWYG from './Field/WYSIWYG.jsx';
import Number from './Field/Number.jsx';

import Checkbox from './Field/Checkbox.jsx';
import Select from './Field/Select.jsx';
import Multiselect from './Field/Multiselect.jsx';
import Image_Select from './Field/Image_Select.jsx';

import WP_Object from './Field/WP_Object.jsx';
import WP_Objects from './Field/WP_Objects.jsx';
import Link from './Field/Link.jsx';

import File from './Field/File.jsx';
import Image from './Field/Image.jsx';
import Repeater from './Field/Repeater.jsx';
import Complex from './Field/Complex.jsx';

import ConditionalLogic from './Field/ConditionalLogic.jsx';

export default function getFieldType( field ) {
	let fieldClass;

	if( field.type !== Field ) {
		return field.type;
	}

	switch( field.props.type.toLowerCase() ) {
		case 'section':      fieldClass = Section; break;
		case 'message':      fieldClass = Message; break;

		case 'text':         fieldClass = Text; break;
		case 'password':     fieldClass = Password; break;
		case 'textarea':     fieldClass = Textarea; break;
		case 'wysiwyg':      fieldClass = WYSIWYG; break;
		case 'number':       fieldClass = Number; break;

		case 'checkbox':     fieldClass = Checkbox; break;
		case 'select':       fieldClass = Select; break;
		case 'multiselect':  fieldClass = Multiselect; break;
		case 'image_select': fieldClass = Image_Select; break;

		case 'file':        fieldClass = File; break;
		case 'image':       fieldClass = Image; break;

		case 'wp_object':    fieldClass = WP_Object; break;
		case 'wp_objects':   fieldClass = WP_Objects; break;
		case 'link':         fieldClass = Link; break;

		case 'repeater':    fieldClass = Repeater; break;
		case 'complex':     fieldClass = Complex; break;

		// ui
		case 'conditional_logic': fieldClass = ConditionalLogic; break;
		
		default:         {
			console.warn( 'Unknown field type: ' + field.props.type );
			fieldClass = Text;
		}
	}

	return fieldClass;
}
