import { TermSchema, DefinitionSchema, ExampleSchema, version } from './DBInfo.js';
const Realm = require('realm');
var RNFS = require('react-native-fs');

export async function createDB() {
	let dictionary = require('./dictionary.json');
	let definitions = dictionary.dictionary;

	Realm.open({
		path: RNFS.DocumentDirectoryPath + '/dictionary.db',
		schema: [TermSchema, DefinitionSchema, ExampleSchema],
		schemaVersion: version
	}).then(realm => {
		console.log('Creating DB...')
		realm.write(() => {
			for (let def of definitions) {
				realm.create('Term', def, true);
			}
		});
		realm.close();
		console.log('DB Created')
	}).catch(e => {
		console.log(e);
	});
}

createDB();