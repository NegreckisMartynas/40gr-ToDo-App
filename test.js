import {asyncPipeWithMap} from './src/util.js'


asyncPipeWithMap(
    (_)       => console.log('start'),
    (_, map)  => map.set('a', 10),
    (_, map)  => map.set('b', 15),
    (_, map)  => map.get('a') + map.get('b'),
    (sum)     => console.log(sum)
).finally(_ => console.log('done'));