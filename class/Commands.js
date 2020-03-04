const TextTransform = require('./TextTransform');
const person = require('../doc_models/person');


module.exports = class Commands {
  
    /**
     * Добавляет пользователя в базу
     * @param {string} matches 
     * @param {special mongo object} collection 
     */
    static add( matches) {
      if(!matches) {
        throw Error('matches is empty' );
      } 
      const person_generate = TextTransform.translateFieldstoEng(matches);
      if(person_generate.surname 
        && person_generate.shift 
        && person_generate.position) {
          return person_generate;
        } else {
          return false;
        }
    }


    static remove() {
    }


    static filter( matches ) {
      if(!matches) {
        throw Error('matches is empty' );  
      } 
      const array_matches  = TextTransform.getArray( matches );

    }
    static change() {

    }

    /**
     * 
     * @param {array || string} matches 
     * @param {object} collection 
     */
    static find( matches, collection ) {
      if(!matches) {
        throw Error('matches is empty' );  
      } 

      const translate_key = TextTransform.getTranslateKey( matches )
      return collection.find(translate_key)
    }

    /**
     * 
     * @param {array || string} matches 
     * @param {object} collection 
     */
    static findOne( matches, collection ) {
      if(!matches) {
        throw Error('matches is empty' );  
      } 

      const translate_key = TextTransform.getTranslateKey( matches )
      return collection.findOne(translate_key)
    }
    
} 