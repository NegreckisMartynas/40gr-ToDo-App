import mysql from 'mysql2';

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    port: 3306,
    user: 'todoapp',
    password: 'bit',
    database: 'todoapp'
});

export function connect() {
    return pool;
}

export async function getConnection() {
    return await new Promise((resolve, reject) => 
        pool.getConnection((err, conn) => {
            if(err) return reject(err);
            resolve(conn);
        })
    );
}

export function releaseConnection(connection) {
    pool.releaseConnection(connection);
}