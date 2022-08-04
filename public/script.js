const savedText = {}



function deleteNote(id) {
    fetch(`/?id=${id}`, {method: 'DELETE'})
        .then(res => window.location = res.url);
}

function editNote(id, clickedButton) {
    const container = containerOfButton(clickedButton);

    const noteText = container.querySelector('.note-text');
    savedText[id] = noteText; //save initial element to memory

    const input = createNoteEditInput(noteText.innerText)
    container.replaceChild(input, noteText);

    enableButtonGroup('edit');
}

function saveEdit(id, clickedButton) {
    restoreNoteTextElement(id, clickedButton, true); // switch input and text, SAVE input
    enableButtonGroup('standard');

    fetch('/', {method: 'PATCH',
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify({id, note: noteEdit.value})}
    )
}

function undoEdit(id, clickedButton) {
    restoreNoteTextElement(id, clickedButton, false); // switch input and text, don't save input
    enableButtonGroup('standard');
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

function restoreNoteTextElement(id, clickedButton, saveInputValue = false) {
    const container = containerOfButton(clickedButton);
    const noteEdit = container.querySelector('.note-edit')
    const noteText = savedText[id]; //get initial element from memory

    container.replaceChild(noteText, noteEdit);
    delete savedText[id]; //remove element from memory

    if(saveInputValue) { // if need to save, change text to input value
        noteText.innerText = noteEdit.value;
    }
}

function enableButtonGroup(groupClass) {
    container.querySelectorAll('.buttons>button') 
             .forEach(button => button.classList.add('hidden'));//hide all buttons
    container.querySelectorAll(`.${groupClass}`)
             .forEach(button => button.classList.remove('hidden'));//unhide only required buttons
}