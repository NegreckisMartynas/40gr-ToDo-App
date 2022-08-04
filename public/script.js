const savedText = {}

function deleteNote(id) {
    fetch(`/?id=${id}`, {method: 'DELETE'})
        .then(res => window.location = res.url);
}

function editNote(id, element) {
    const container = element.parentElement
                             .parentElement;

    const noteText = container.querySelector('.note-text');
    savedText[id] = noteText;

    const input = document.createElement('input');
    input.classList.add('note-edit')
    input.type = 'text';
    input.value = noteText.innerText;
    container.replaceChild(input, noteText);

    container.querySelectorAll('.buttons>button')
             .forEach(button => button.classList.add('hidden'));
    container.querySelectorAll('.edit')
             .forEach(button => button.classList.remove('hidden'));
}

function saveEdit(id, element) {
    const container = element.parentElement
                             .parentElement;

    const noteEdit = container.querySelector('.note-edit')
    const noteText = savedText[id];

    container.replaceChild(noteText, noteEdit);
    delete savedText[id];
    noteText.innerText = noteEdit.value;

    fetch('/', {method: 'PATCH',
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify({id, note: noteEdit.value})}
    )

    container.querySelectorAll('.buttons>button')
             .forEach(button => button.classList.add('hidden'));
    container.querySelectorAll('.standard')
             .forEach(button => button.classList.remove('hidden'));
}

function undoEdit(id, element) {
    const container = element.parentElement
                             .parentElement;

    const noteEdit = container.querySelector('.note-edit')
    const noteText = savedText[id];

    container.replaceChild(noteText, noteEdit);
    delete savedText[id];

    container.querySelectorAll('.buttons>button')
             .forEach(button => button.classList.add('hidden'));
    container.querySelectorAll('.standard')
             .forEach(button => button.classList.remove('hidden'));
}