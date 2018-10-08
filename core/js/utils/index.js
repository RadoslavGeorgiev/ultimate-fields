import { uniqueId } from 'lodash';

export const generateContainerId = ( base = 'container-' ) => {
	return uniqueId( base );
}
