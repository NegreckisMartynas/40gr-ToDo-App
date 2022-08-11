import cron from 'node-cron';
import {connect} from './src/connect.js'

cron.schedule('0 0 * * * *', () => {
    //DELETE FROM loginTokens WHERE now() > DATE_ADD(createdAt, INTERVAL 2 hour);
    connect().execute('DELETE FROM loginTokens WHERE now() > DATE_ADD(createdAt, INTERVAL 4 hour)', (err, _) => {
        if(err) console.log(err);
        else {
            const date = new Date();
            console.log(date, 'Deleting loginTokens older than 4 hours');
        }
    });
});