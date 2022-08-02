export default function renderMainPage(req, res) {
    const newNote = req.query.note;
    const model = {};
    model.title = 'My To-do App';
    const notes = [
        'Example note text', 
        'Another note',
        'And another note'
    ];
    if(newNote) {
        notes.push(newNote);
    }
    model.notes = notes;

    res.render('index', {model})
}