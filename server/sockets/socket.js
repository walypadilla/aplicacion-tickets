const { io } = require('../server');
const { TicketControl } = require('../classes/ticket-control');

const ticketControl = new TicketControl;

io.on('connection', (client) => {

    client.on('siguienteTicket', ( data, callback ) => {

        let siguiente = ticketControl.siguienteTicket();

        console.log('El siguiente ticket es: ', siguiente);
        callback( siguiente );

    });

    // emitir evento 'estado actual

    client.emit('estadoActual', {
        actual: ticketControl.getUltimoTicket(),
        ultimosCuatro: ticketControl.getUltimosCuatro()
    });

    client.on('atenderTicket', (data, callback) => {

        if ( !data.escritorio ) {
            return callback ({
                err: true,
                mensaje: 'El escritorio es necesario'
            });
        }

        let atenderTicket = ticketControl.atenderTicket( data.escritorio );

        callback( atenderTicket );

        // actualizar/notificar cambios en los ULTIMOS 4
        client.broadcast.emit('ultimosCuatro', {
            ultimosCuatro: ticketControl.getUltimosCuatro()
        });

    });

});