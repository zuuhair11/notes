import React, { useState, useEffect } from 'react' ;
import Sidebar from './components/Sidebar' ;
import Editor from './components/Editor' ;
import Split from 'react-split' ;

// "onSnapshot" This function allows you to listen for real-time changes to a query. 
//              It sets up a listener that triggers a callback function 
//              whenever there are changes in the result of the query.
// "addDoc" Add a new document to a collection in the Firestore database, it returns a Promise
// "doc" helps us get access to a single document
// "deleteDoc" helps us delete the doc
// "setDoc" helps us to update our doc
import { onSnapshot, addDoc, doc, deleteDoc, setDoc } from 'firebase/firestore' ;
import { db, notesCollection } from './firebase' ;


function App() {
    const [notes, setNotes] = React.useState([]);
    const [currentNoteId, setCurrentNoteId] = useState('');
    const [tempNoteText, setTempNoteText] = useState('');
    
    const currentNote = notes.find( note => note.id === currentNoteId ) || notes[0];

    const sortedNotes = notes.sort( (noteA, noteB) => {
        if(noteB.updatedAt > noteA.updatedAt) return 1;
        if(noteB.updatedAt < noteA.updatedAt) return -1;

        return 0;
    });

    useEffect( () => {
        // Set up a real-time listener for the 'notes' collection
        const unsubscribe = onSnapshot(notesCollection, function(snapshot) {
            // Handle the changes here
            const notesArray = snapshot.docs.map( doc => {
                return {
                    ...doc.data(),
                    id: doc.id
                }
            });

            setNotes(notesArray);
        });

        // The real-time listener (onSnapshot) will continuously listen 
        // for changes until you unsubscribe from it 
        // by calling the unsubscribe function returned from onSnapshot
        return unsubscribe;
    }, []);

    useEffect( () => {
        if(!currentNoteId) {
            setCurrentNoteId( notes[0]?.id );
        }

    }, [notes]);

    useEffect( () => {
        if(currentNote) {
            setTempNoteText(currentNote.body)
        }
        
    }, [currentNote]);

    useEffect( () => {
        const timeoutId = setTimeout( () => {
            // Prevent the update at the first click
            if(tempNoteText !== currentNote?.body) {
                updateNote(tempNoteText);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [tempNoteText]);

    async function createNewNote() {
        const newNote = {
            body: '# Type your markdown note\'s title here',
            createdAt: Date.now(),
            updatedAt: Date.now()
        }

        const newNoteRef = await addDoc(notesCollection, newNote);
        setCurrentNoteId(newNoteRef.id);
    }

    async function updateNote(text) {
        const docRef = doc(db, 'notes', currentNoteId);
        // merge: performs a merge update instead of overwriting the entire document
        // means that only the specified fields in the data object will be updated, 
        // and any existing fields not included in the data object will remain unchanged
        await setDoc(docRef, { body: text, updatedAt: Date.now() }, { merge: true });
    }

    async function deleteNote(noteId) {
        const docRef = doc(db, 'notes', noteId);
        await deleteDoc(docRef);
    }


    return (
        <main>
            {
                notes.length > 0
                    ?
                    <Split
                        sizes={ [30, 70] }
                        direction="horizontal"
                        className="split"
                    >
                        <Sidebar
                            notes={ notes }
                            currentNote={ currentNote }
                            setCurrentNoteId={ setCurrentNoteId }
                            newNote={ createNewNote }
                            deleteNote={ deleteNote }
                        />
                        <Editor
                            tempNoteText={ tempNoteText }
                            setTempNoteText={ setTempNoteText }
                        />
                    </Split>

                    :
                    <div className="no-notes">
                        <h1>You have no notes</h1>
                        <button
                            className="first-note"
                            onClick={ createNewNote }
                        >
                            Create one now
                        </button>
                    </div>
            }
        </main>
    );
}


export default App ;
