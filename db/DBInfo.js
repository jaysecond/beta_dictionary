export const termMarkers = ['lx', 'ph', 'sf2'];
export const defMarkers = ['le', 'ps', 'de', 'gn', 'ex', 'rt', 'sm'];
export const exMarkers = ['xe', 'xn', 'xv', 'sf'];

export const version = 16;

export const ExampleSchema = {
	name: 'Example',
	properties: {
		def: { type: 'linkingObjects', objectType: 'Definition', property: 'ex' },
		xv: 'string?',
		xn: 'string?',
		xe: 'string?',
		sf: 'string?'
	}
};

export const DefinitionSchema = {
	name: 'Definition', 
	properties: { 
		term: { type: 'linkingObjects', objectType: 'Term', property: 'def' }, 
		de: 'string?', 
		gn: 'string?', 
		ps: 'string?',
		pn: 'string?',
		ex: { type: 'list', objectType: 'Example' }, 
		le: 'string?', 
		rt: 'string?',
		sm: 'string?'
	}
};

export const TermSchema = {
	name: 'Term', 
	primaryKey: 'lx', 
	properties: {
		lx: { type: 'string', indexed: true }, 
		ph: 'string?', 
		sf2: 'string?', 
		def: { type: 'list', objectType: 'Definition' }
	}
};

