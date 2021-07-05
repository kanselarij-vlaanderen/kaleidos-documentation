// Store methods

// Store method return values are not regular Promises/Arrays

/** 
 * @typedef {RecordArray}
 * contains MutableArray methods (e.g. sortBy), but not JavaScript-Array methods (e.g. sort)
 * @link https://api.emberjs.com/ember/3.26/classes/MutableArray
 * 
 * @typedef {PromiseArray}
 * resolves to empty array, when fetch not finished yet
 * @link https://api.emberjs.com/ember-data/release/classes/PromiseArray
 */

// FIND: from cache, if not found, fetch
/** @type {PromiseArray<RecordArray<Model>>}*/
const promiseArray = this.store.findAll('case')
/** @type {RecordArray<Model>} */
const recordsArray = await promiseArray
/** @type {Array<Model>} */
const jsArray = recordsPromise.toArray()

/** @type {Promise<Model>} */
const casePromise = await this.store.findRecord('case', id, options)

// QUERY: fetch always
/** @type {PromiseArray<RecordArray<Model>>} */
const cases = this.store.query('case', queryOptions)
/**
 * custom Kaleidos
 * @type {Promise<Model|null>}
 */
const case_ = this.store.queryOne('case', queryOptions) 

// PEEK: cache 
// no await
/** @type {RecordArray<Model>} */
const cases = this.store.peekAll('case')
/** @type {Model} */
const case_ = this.store.peekRecord('case', id)

const queryOptions = {
  // - list of property names (not model names) 
  // - kebab-cased-like-this
  // - to include a 2nd-degree related model, include related model
  include: 'case,case.subcases',
  'filter[case][subcases][:id:]': id,
  'filter[case][subcases][title]': textSearch,
  'page[size]': 20,
  sort: '-created',
}