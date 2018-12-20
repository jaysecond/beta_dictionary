import { TermSchema, DefinitionSchema, ExampleSchema, version } from '../db/DBInfo.js';
import Realm from 'realm';
var RNFS = require('react-native-fs');

async function query(realm, term, str, results) {
  return new Promise(async function(resolve, reject) {
    tmp = new Promise.resolve(realm.objects('Term').filtered(str, term));

    tmp
      .then(success => {results.push(success)})
      .then(success => {resolve(results)})

  })
}

async function query_eng(realm, term_1, term_2, str, results) {
  return new Promise(async function(resolve, reject) {
    tmp = new Promise.resolve(realm.objects('Term').filtered(str, term_1, term_2));

    tmp
      .then(success => {results.push(success)})
      .then(success => {resolve(results)})

  })
}

async function getListOfTerms(realm, term) {
  return new Promise((resolve, reject) => {
    let results = []
    if (term.match(/[\u0f00-\u0fff]+$/)) {
      query(realm, term, 'lx CONTAINS $0', results)
        .then(success => query(realm, term, 'def.le CONTAINS $0 && NOT lx CONTAINS $0', results))
        .then(success => query(realm, term, 'def.ex.xv CONTAINS $0 && NOT def.le CONTAINS $0 && NOT lx CONTAINS $0', results))
        .then(success => {
          resolve(success)
        })
    } else if (term.match(/[\u3400-\u9fbf]+$/)) {
      query(realm, term, 'def.gn CONTAINS $0', results)
        .then(success => query(realm, term, 'def.ex.xn CONTAINS $0 && NOT def.gn CONTAINS $0', results))
        .then(success => {
          resolve(success)
        })
    } else if (term.match(/[\u0020-\u007f]+$/)) {
      query(realm, ' ' + term + ' ', 'def.de CONTAINS[c] $0', results)
        .then(success => query_eng(realm, term, ' ' + term + ' ', 'def.de CONTAINS[c] $0 && NOT def.de CONTAINS[c] $1', results))
        .then(success => query_eng(realm, ' ' + term + ' ', term, 'def.ex.xe CONTAINS[c] $0 && NOT def.de CONTAINS[c] $1', results))
        .then(success => query_eng(realm, term, ' ' + term + ' ', 'def.ex.xe CONTAINS[c] $0 && NOT def.ex.xe CONTAINS[c] $1 && NOT def.de CONTAINS[c] $0', results))
        .then(success => {
          resolve(success)
        })
    } else {
      query(realm, term, 'ph CONTAINS[c] $0', results)
        .then(success => {
            resolve(success)
          })
    }

  })
}

async function getTerm(realm, term) {
  return new Promise(async function(resolve, reject) {
    results = new Promise.resolve(realm.objects('Term').filtered('lx == $0', term));

    results
      .then(success => formatTerm(success))
      .then(success => {resolve(success)})
  })
}

export function queryForTerms(term) {

  return makeCancelable( 
    new Promise(function (resolve, reject) {
        final_results = []
        Realm.open({
            path: RNFS.DocumentDirectoryPath + '/dictionary.db',
            schema: [TermSchema, DefinitionSchema, ExampleSchema],
            schemaVersion: version
          }).then(realm => {
            getListOfTerms(realm, term)
              .then(success => formatResults(success, term, final_results))
              .then(success => {
                realm.close()
                resolve({
                  term: term,
                  results: final_results
                })
              })
          });

    })
  );

}

export async function queryForTerm(term) {
  return new Promise( function (resolve, reject) {
        Realm.open({
            path: RNFS.DocumentDirectoryPath + '/dictionary.db',
            schema: [TermSchema, DefinitionSchema, ExampleSchema],
            schemaVersion: version
          }).then(realm => {
            getTerm(realm, term)
              .then(success => {
                console.log(success)
                realm.close()
                resolve(success)
              })
          });
    })
}

const makeCancelable = (promise) => {
  let hasCanceled_ = false;

  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then(
      val => hasCanceled_ ? reject({isCanceled: true}) : resolve(val),
      error => hasCanceled_ ? reject({isCanceled: true}) : reject(error)
    );
  });

  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled_ = true;
    },
  };
};

async function formatResults(list_results, search_term, final_results) {
  list_results.forEach(async function(list) {
    list.forEach(async function(term) {
      sub = new Promise.resolve(findDefs(term, search_term));

      sub
        .then(success => final_results.push({'lx': term.lx, 'sub': success}))
    })
    // Object.values(list).forEach(async function(term) {
    //   sub = new Promise.resolve(findDefs(term, search_term));

    //   sub
    //     .then(success => final_results.push({'lx': term.lx, 'sub': success}))
    // })
  })
}

async function formatTerm(term_results) {
  tmp = {};

  Object.values(term_results).forEach((term, index) => {
    tmp_term = {}
    Object.keys(term).forEach(term_key => {

      if(term_key === 'def') {
        tmp_term[term_key] = {};

        Object.values(term[term_key]).forEach((def, index) => {
          tmp_def = {}
          Object.keys(def).forEach(def_key => {

            if(def_key === 'ex') {
              tmp_def[def_key] = {}

              Object.values(def[def_key]).forEach((ex, index) => {
                tmp_ex = {}
                Object.keys(ex).forEach(ex_key => {

                  if(ex_key !== 'def') {
                    tmp_ex[ex_key] = ex[ex_key];
                  }

                });
                tmp_def[def_key][index] = tmp_ex;
              });
            } else if (def_key !== 'term') {
              tmp_def[def_key] = def[def_key];
            }

          });
          tmp_term[term_key][index] = tmp_def;
        });

      } else {
        tmp_term[term_key] = term[term_key]
      }

    });
    tmp[index] = tmp_term;
  });

  return tmp;
}

async function findDefs(item, searchTerm) {
  results = [];
  search_term = searchTerm.toLowerCase();

  if(searchTerm.match(/[\u0f00-\u0fff]+$/)) {
    if(item['lx'].includes(search_term) && item.hasOwnProperty('def')) {
      item['def'].forEach((def, i) => {
        index = (i + 1).toString();
        if(def.hasOwnProperty('gn') && def['gn'] !== null) {
          results.push(def['gn']);
        }
        if(def.hasOwnProperty('de') && def['de'] !== null) {
          results.push(def['de']);
        }
        if(def.hasOwnProperty('le') && def['le'] !== null && def['le'].includes(search_term)) {
          results.push(def['le']);
        }
        if(def.hasOwnProperty('ex')) {
          def['ex'].forEach(ex => {
            if(ex.hasOwnProperty('xv') && ex['xv'] !== null && ex['xv'].includes(search_term)) {
              for(example in ex) {
                if(ex[example] !== null && example !== 'def' && example !== 'sf') {
                  results.push(ex[example])
                }
              }
            }
          })
        }
      })
      if(results.length === 0) {
        item['def'].forEach(def => {
          if(def.hasOwnProperty('sm') && def['sm'] !== null) {
            results.push(def['sm']);
          }
        })
      } 
    } 
    else if(item.hasOwnProperty('def')) {
      item['def'].forEach(def => {
        if(def.hasOwnProperty('le') && def['le'] !== null && def['le'].includes(search_term)) {
          results.push(def['le']);
        } 
        if(def.hasOwnProperty('ex')) {
          def['ex'].forEach(ex => {
            if(ex.hasOwnProperty('xv') && ex['xv'] !== null && ex['xv'].includes(search_term)) {
              for(example in ex) {
                if(ex[example] !== null && example !== 'def' && example !== 'sf') {
                  results.push(ex[example])
                }
              }
            }
          })
        }
      })
    }
  } else if(searchTerm.match(/[\u3400-\u9fbf]+$/)) {
    if(item.hasOwnProperty('def')) {
      item['def'].forEach((def, i) => {
        index = (i + 1).toString();
        if(def.hasOwnProperty('gn') && def['gn'] !== null && def['gn'].includes(search_term)) {
          results.push(def['gn']);
        } 
        if(def.hasOwnProperty('ex')) {
          def['ex'].forEach(ex => {
            if(ex.hasOwnProperty('xn') && ex['xn'] !== null && ex['xn'].includes(search_term)) {
              for(example in ex) {
                if(ex[example] !== null && example !== 'def' && example !== 'sf') {
                  results.push(ex[example])
                }
              }
            }
          })
        }
      })
    }
  } else if(searchTerm.match(/[\u0020-\u007f]+$/)) {
    if(item.hasOwnProperty('def')) {
      item['def'].forEach((def, i) => {
        index = (i + 1).toString();
        if(def.hasOwnProperty('de') && def['de'] !== null && def['de'].toLowerCase().includes(search_term)) {
          results.push(def['de']);
        } 
        if(def.hasOwnProperty('ex')) {
          def['ex'].forEach(ex => {
            if(ex.hasOwnProperty('xe') && ex['xe'] !== null && ex['xe'].toLowerCase().includes(search_term)) {
              for(example in ex) {
                if(ex[example] !== null && example !== 'def' && example !== 'sf') {
                  results.push(ex[example])
                }
              }
            }
          })
        }
      })
    }
  } else {
    if(item.hasOwnProperty('ph') && item['ph'] !== null && item['ph'].toLowerCase().includes(search_term)) {
      results.push(item['ph']);

      item['def'].forEach((def, i) => {
        index = (i + 1).toString();
        if(def.hasOwnProperty('de') && def['de'] !== null) {
          results.push(def['de']);
        }
        if(def.hasOwnProperty('gn') && def['gn'] !== null) {
          results.push(def['gn']);
        }
      })
    }
  }

  return results;
};

