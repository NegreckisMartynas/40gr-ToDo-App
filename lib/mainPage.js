export default function renderMainPage(req, res) {
    const model = {};
    model.title = 'My To-do App';

    res.render('index', {model})
}