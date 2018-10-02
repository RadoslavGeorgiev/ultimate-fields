import { registerFieldType } from './';

import tabField from './tab';
import textField from './text';
import checkboxField from './checkbox';
import repeaterField from './repeater';

tabField( registerFieldType );
textField( registerFieldType );
checkboxField( registerFieldType );
repeaterField( registerFieldType );
