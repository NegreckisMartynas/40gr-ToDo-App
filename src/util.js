import { getConnection, releaseConnection } from "./connect.js";


/**
 * Reuses same connection for all passed functions.
 * First parameter must be connection, other is result of previous function
 * @param  {...(connection, any?) => any} args 
 */
export async function withSameConnection(...args) {
    const connection = await getConnection();
    return await args.map(f => (data) => f(connection, data))
                     .reduce((f, g) => f.then(g), Promise.resolve())// pipe
                     .finally(() => releaseConnection(connection))//release connection when done
}

// export async function asyncPipeArgs(...functions) {
//     return await asyncPipe([...functions]);
// }

// export async function asyncPipe(functions) {
//     return await functions.reduce((f, g) => f.then(g), Promise.resolve());
// }

// export function startWithArgs(parameter) {
//     return (...args) => startWith(parameter)([...args]);
// }

// export function startWith(parameter) {
//     return (args) => args.map(f => (data) => f(parameter, data));
// }

// export async function _withSameConnection(...args) {
//     const connection = await getConnection();
//     return await asyncPipeArgs( 
//                     () => args, 
//                     startWith(connection),
//                     asyncPipe
//                 ).finally(() => releaseConnection(connection));
// }
