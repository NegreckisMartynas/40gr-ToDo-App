import { getConnection, releaseConnection } from "./connect.js";


/**
 * Reuses same connection for all passed functions.
 * First parameter must be connection, other is result of previous function
 * @param  {...(connection, any?) => any} args 
 */
export async function withSameConnection(...functions) {
    const connection = await getConnection();
    return await asyncPipe(...mappingFirstParameter(connection)(...functions))
                    .finally(() => releaseConnection(connection));
}

export async function asyncPipe(...functions) {
    return await functions.reduce((f, g) => f.then(g), Promise.resolve());
}

export function mappingFirstParameter(parameter) {
    return (...args) => args.map(f => (data, ...innerArgs) => f(parameter, data, ...innerArgs));
}
export function mappingSecondParameter(parameter) {
    return (...args) => args.map(f => (data, ...innerArgs) => f(data, parameter, ...innerArgs));
}

export async function asyncPipeWithMap(...functions) {
    const map = new Map();
    const functionsWithMap = mappingSecondParameter(map)(...functions);
    return asyncPipe(...functionsWithMap);
}