import { registerFieldType } from './';

import textField from './text';
import checkboxField from './checkbox';
import repeaterField from './repeater';

textField( registerFieldType );
checkboxField( registerFieldType );
repeaterField( registerFieldType );
