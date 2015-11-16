var JohnnyFive = Meteor.npmRequire('johnny-five'),
    board;

Meteor.startup(function(){
    board = new JohnnyFive.Board();

    board.on('error', function (error) {
        console.error('Johnny Five Error', error);
    });

    board.on("ready", Meteor.bindEnvironment(function() {

        var led = new JohnnyFive.Led(13);

        led.blink(500);

    }, "ready"));
});