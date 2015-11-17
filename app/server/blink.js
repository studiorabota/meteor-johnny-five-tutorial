var JohnnyFive = Meteor.npmRequire('johnny-five'),
    board;

Meteor.startup(function(){
    board = new JohnnyFive.Board();

    board.on('error', function (error) {
        console.error('Johnny Five Error', error);
    });

    board.on("ready", function() {

        var matrix = new JohnnyFive.Led.Matrix({
            pins: {
                data: 2,
                clock: 3,
                cs: 4
            }
        });

        matrix.on();

        function next() {

            matrix.draw(serverData);
            setTimeout(next, 1000);

        }

        next();

    });

});