const { Connection } = require('tedious');
const { Request } = require('tedious');
const TYPES = require('tedious').TYPES;

module.exports = async function (context, eventHubMessages) {

    const config = {  
        server: 'sql-srv-ioth-events.database.windows.net',
        authentication: {
            type: 'default',
            options: {
                userName: 'iothEventDBAdmin',
                password: process.env.DB_WARM_ADMIN_PASSWORD  
            }
        },
        options: {
            encrypt: true,
            database: 'sql-db-warm-path'
        }
    }; 

    const query = 'INSERT INTO Events (EventID, NodeID, CreationTimestamp, EventType, Payload) VALUES (@eventId, @nodeId, @timestamp, @event, @payload);';

    eventHubMessages.forEach((message) => {
        message.forEach((event) => {

            const connection = new Connection(config);
            connection.on('connect', (err) => {
                if (err) {
                    context.log("Error on connection! " + err);
                    context.res = {
                        status: 500,
                        body: `Error on connection! ${err}`
                    };
                }
                
                const request = new Request(query, ((err, rowCount) => {
                    if (err) {
                        context.res = {
                            status: 500, 
                            body: `Error on query! ${err}`
                        }
                        context.log("Error on request! " + err);
                    } else {
                        context.log(`${rowCount} AFFECTED ROWS`);
                    }
                }));
    
                request.on("requestCompleted", function() {
                    connection.close();
                    context.log("Connection closed!")
                    context.res = {
                        status: 200,
                        body: "Request Completed!"
                    }
                })
                
                request.addParameter(`eventId`, TYPES.Char, event.eventId);
                request.addParameter(`nodeId`, TYPES.Text, event.nodeId);
                request.addParameter(`timestamp`, TYPES.BigInt, event.timestamp);
                request.addParameter(`event`, TYPES.Text, event.event);
                request.addParameter(`payload`, TYPES.Text, JSON.stringify(event.payload));
    
                connection.execSql(request);
            });
        
            connection.connect();
        })
    });
};