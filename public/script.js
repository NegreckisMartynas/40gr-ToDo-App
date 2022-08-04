const savedText = {}

function deleteNote(id) {
    fetch(`/?id=${id}`, {method: 'DELETE'})
        .then(res => window.location = res.url);
}

function editNote(id, clickedButton) {
    const container = containerOfButton(clickedButton);

    const noteText = container.querySelector('.note-text');
    savedText[id] = noteText;

    const input = createNoteEditInput(noteText.innerText)
    container.replaceChild(input, noteText);

    enableButtonGroup('edit');
}

function createNoteEditInput(initialText) {
    const input = document.createElement('input');
    input.classList.add('note-edit')
    input.type = 'text';
    input.value = initialText;
    return input;
}

function containerOfButton(buttonElement) {
    return buttonElement.parentElement.parentElement;
}

function saveEdit(id, clickedButton) {
    const [noteEdit, noteText] = restoreNoteTextElement(id, clickedButton);
    noteText.innerText = noteEdit.value;

    fetch('/', {method: 'PATCH',
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify({id, note: noteEdit.value})}
    )

    enableButtonGroup('standard');
}

function undoEdit(id, clickedButton) {
    restoreNoteTextElement(id, clickedButton);
    enableButtonGroup('standard');
}

function restoreNoteTextElement(id, clickedButton) {
    const container = containerOfButton(clickedButton);
    const noteEdit = container.querySelector('.note-edit')
    const noteText = savedText[id];

    container.replaceChild(noteText, noteEdit);
    delete savedText[id];

    return [noteEdit, noteText];
}

function enableButtonGroup(groupClass) {
    container.querySelectorAll('.buttons>button') 
             .forEach(button => button.classList.add('hidden'));//hide all buttons
    container.querySelectorAll(`.${groupClass}`)
             .forEach(button => button.classList.remove('hidden'));//unhide only required buttons
}