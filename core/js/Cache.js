class Cache {
	items = {}

	set( name, item ) {
		this.items[ name ] = item;
	}

	get( name ) {
		return this.items[ name ] || null;
	}

	flush() {
		this.items = {};
	}
}

const cache = new Cache;

export default cache;
