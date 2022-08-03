function deleteNote(id) {
    fetch(`/?id=${id}`, {method: 'DELETE'})
        .then(res => window.location = res.url);
}