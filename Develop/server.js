// Create the server
const express = require('express');

const {writeFile} = require('fs');

const path = require('path');

const noteDb = require('./db/db.json');

const exp = require('constants');

const PORT = 3001;

const app = express();


app.use(express.static('public'));

app.use(express.json());

app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, 'public','notes.html')));

// API routes

app.get('/api/notes', (req, res) => res.json(noteDb));

app.post('/api/notes', (req, res) => {
    // Get new note
    const newNote = req.body;
    // Give new note an ID based on past notes stored in db.json
    newNote.id = noteDb.length === 0 ? 1 : noteDb[noteDb.length - 1].id + 1;
    noteDb.push(newNote);
    const stringifyNoteDb = JSON.stringify(noteDb, '', 4);
    writeFile('./db/db.json', stringifyNoteDb, (writeErr) => {
        if (writeErr) {
            console.error(writeErr);
        }
        else {
            console.log('updated db.json');
        };
    });
    res.redirect('/notes');
});

app.get('/api/notes/:id', (req, res) => {
    const noteId = parseInt(req.params.id);
    // If no notes in db.json send user error message
    if (noteDb.length === 0) {
        const errorObj = {
            error: "no notes in array."
        };
        res.status(404).json(errorObj);
    }
    else {
        // If searching for ID that is not in db.json send user error message
        if (noteId > noteDb.length) {
            const errorObj = {
                error: "no note with that id exists."
            };
            res.status(404).json(errorObj);
        }
        else {
            res.status(200).json(noteDb[noteId - 1]);
        };
    };
});  

app.delete('/api/notes/:id', (req, res) => {
    const noteId = parseInt(req.params.id);
    // Iterate through note object array (db.json)
    for (note in noteDb) {
        // If matching note is found remove matching note from array and update db.json
        if (noteDb[note].id === noteId) {
            noteDb.splice(note, 1);
            const stringifyNoteDb = JSON.stringify(noteDb, '', 4);
            writeFile('./db/db.json', stringifyNoteDb, (writeErr) => {
                if (writeErr) {
                    console.error(writeErr);
                }
                else {
                    console.log('updated db/db.json');
                };
            });
            res.status(200).send('notes.html');
        };
    };
});

// Catch all other routes and redirect to index.html

app.get('*', (req, res) => res.redirect('/'));

app.listen(PORT, () => console.log(`listening on http://localhost:${PORT}`));