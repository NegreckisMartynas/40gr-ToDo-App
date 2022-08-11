import {doInOrder} from './src/util.js'


doInOrder(
    _           => console.log('start'),
    (_, store)  => store('a', 10),
    (_, store)  => store('b', 15),
    (_,__, take) => console.log(take('a') + take('b'))
).finally(_ => console.log('done'));