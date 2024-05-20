// Create the server

const express = require('express');

const {readFile, writeFile} = require('fs');

const Uid = require('short-unique-id');

const path = require('path');

const noteDb = require('./db/db.json');

const exp = require('constants');

const PORT = 3001;


const app = express();

app.use(express.static('public'));

app.use(express.json());

app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, 'public', 'notes.html')));

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
        res.redirect('notes.html');
});

app.get('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;

})  

app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;
    console.log(noteDb);
});



app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public','index.html')));


app.listen(PORT, () => console.log(`listening on http://localhost:${PORT}`));