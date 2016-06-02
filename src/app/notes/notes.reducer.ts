import { Note } from './note.model';
import { Action, Reducer } from '@ngrx/store';
import 'node-uuid';
declare let uuid;
//uuid.v1()

export const notes: Reducer<Array<Note>> = (notes: Array<Note> = [], action: Action) => {
  switch(action.type){
    //Front end Actions
    case "ADD_NOTE":
      return [
        ...notes,
        Object.assign({}, action.payload, {dirty: true})      
      ]
    case "UPDATE_NOTE_TEXT":
      return notes.map(note =>{
        if(note.id === action.payload.id){
          return Object.assign({}, note, {text: action.payload.newText}, {dirty: true})
        } else {
          return note;
        }
      })

    //Back end actions  
    case "ADD_NOTE_FROM_SERVER":
      return [
        ...notes,
        Object.assign({}, action.payload, {dirty: false})      
      ]
    case "UPDATE_NOTE_FROM_SERVER":
      return notes.map(note => {
        /*
        Note - Can't use object equality here as it would introduce a race condition.
        Any change to the note between sending the http post/put
        and invoking this UPDATE action will result in a new object.
        This check will always fail and effectively and 'orphan'
        the data returning from the server.  Even worse, there is a chance
        you could double up items if you post -> update -> post again
        */
        if(note.id === action.payload.originalNote.id){
          return Object.assign({}, action.payload.serverNote, {dirty: false})
        } else {
          return note;
        }
      })
    default:
      return notes;
  }
}