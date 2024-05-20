// Create the server
const express = require('express');

const {readFile, writeFile} = require('fs');

const path = require('path');

const noteDb = require('./db/db.json');

const exp = require('constants');

const PORT = 3001;

const app = express();


app.use(express.static('public'));

app.use(express.json());

app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, 'public', 'notes.html')));

// API

app.get('/api/notes', (req, res) => res.json(noteDb));

app.post('/api/notes', (req, res) => {
    readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err)
        }
        else {
            const newNote = req.body;
            console.log('\n', newNote, '\n');
            newNote.id = noteDb.length === 0 ? 1 : noteDb[noteDb.length - 1].id + 1;
            noteDb.push(newNote);
            const stringifyNoteDb = JSON.stringify(noteDb, '', 4);
            writeFile('./db/db.json', stringifyNoteDb, (writeErr) => {
                if (writeErr) {
                    console.error(writeErr);
                }
                else {
                    console.log('updated db/db.json');
                };
            });
        };
        });
    res.redirect('/notes');
});

app.get('/api/notes/:id', (req, res) => {
    const noteId = parseInt(req.params.id);
    if (noteDb.length === 0) {
        const errorObj = {
            error: "no notes in array."
        };
        res.status(404).json(errorObj);
    }
    else {
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
    for (note in noteDb) {
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

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public','index.html')));

app.listen(PORT, () => console.log(`listening on http://localhost:${PORT}`));