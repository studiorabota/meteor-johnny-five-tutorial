# Control your Arduino with a web app via Meteor and Johnny Five 

>Chapter 1: Meteor and Johnny Five  
Chapter 2: LED Matrix

## Chapter 1: Meteor and Johnny Five

In the first chapter we will set up Meteor with Johnny Five and make an LED blink. Blink! Blink! 

- Level: Intermediate. A bit of JS and Node will help
- Time: 30 - 60 minutes
- Hardware: Arduino, Led Matrix (or one LED)

You will need:

* [Meteor](https://www.meteor.com/)
* [Johnny Five](https://github.com/rwaldron/johnny-five)
* [Node](https://nodejs.org/en/)
* Xcode (Mac app store)
* Xcode command line tools (terminal: `xcode-select --install`)

### 1. Create a Meteor
 
~~~terminal
$: meteor create app
$: cd app
~~~

### 2. Add Jonny Five package

Johnny Five will allow us to talk to the Arduino via Javascript. 

First we need to add the meteorhacks:npm package.

~~~terminal
$: meteor add meteorhacks:npm
~~~

Meteorhacks:npm is a Meteor package for adding Node modules. - [https://github.com/meteorhacks/npm](https://github.com/meteorhacks/npm).

Type the following in your terminal (only for Meteor 1.2 and up):  

~~~terminal
$: rm -rf packages/npm-container
$: meteor remove npm-container
$: meteor update meteorhacks:npm
$: meteor
~~~

You will now have a `Packages.json` file in your root directory. Open the file in your editor and add the packages in between the brackets - like below.

##### packages.json

~~~json
{
	"serialport": "2.0.5",
  	"johnny-five": "0.9.10"
}
~~~

### 3. Johnny Five code

Create a `server` folder and add a JS file, name it blink.js. Meteor will automatically pick it up.

##### server/blink.js

~~~javascript
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
~~~

Start Meteor:

~~~terminal
$: meteor
~~~

This will be the response if everything went okay: 

~~~terminal
$: 'Board Looking for connected device..'
~~~

### 4. Arduino

Install the [Arduino IDE](https://www.arduino.cc/en/Main/Software) and connect your Arduino. Check the terminal, this will now show the port number.. nerd delight.

~~~terminal
$: Connected /dev/cu.usbserial-****
~~~

We now have to upload StandardFirmata to the Arduino. StandardFirmata makes it possible for libraries like Johnny Five to communicate. 

Open the Arduino IDE:
  
1. `File -> Examples -> Firmata -> StandardFirmata` 
2. `Sketch -> Upload`

Place a LED in port 13 and ground - [example](https://raw.githubusercontent.com/rwaldron/johnny-five/master/assets/led-blink.gif). 

These are the lines of code in `blink.js` which make your LED blink.

##### server/blink.js

~~~javascript
var led = new JohnnyFive.Led(13);

led.blink(500);
~~~

## Chapter 2: LED Matrix

In this chapter we will control a 8 dot led matrix via a web interface.

Let's start with displaying a heart. Connect your board similar as in [this illustration](https://github.com/rwaldron/johnny-five/blob/master/docs/led-matrix.md).

In `blink.js` replace the code with the following:

##### server/blink.js

~~~javascript
var JohnnyFive = Meteor.npmRequire('johnny-five'),
    board;

Meteor.startup(function(){
    board = new JohnnyFive.Board();

    board.on('error', function (error) {
        console.error('Johnny Five Error', error);
    });

    board.on("ready", function() {

        var heart = [
            "01100110",
            "10011001",
            "10000001",
            "10000001",
            "01000010",
            "00100100",
            "00011000",
            "00000000"
        ];

        var matrix = new JohnnyFive.Led.Matrix({
            pins: {
                data: 2,
                clock: 3,
                cs: 4
            }
        });

        matrix.on();

        matrix.draw(heart);

    });

});
~~~

You might have guessed it already, in the heart array 1 is for LED on and 0 for LED off.

Now open `app.js` and find the following code:

##### app.js

~~~javascript
Template.hello.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set('counter', Session.get('counter') + 1);
    }
});
~~~

Replace the code above with the one below:

##### app.js

~~~javascript
Template.hello.events({
    'click button': function () {

      var m = [
        "10000001",
        "11000011",
        "10100101",
        "10011001",
        "10000001",
        "10000001",
        "10000001",
        "10000001"
      ];

      Meteor.call('play', m);

    }
});
~~~
   
When you click on the button it will now send an **M** array to a Meteor method via `Meteor.call()`. We do this to parse the data to the server. Create a new file in the root directory called `methods.js`.

##### methods.js

~~~javascript
serverData = [
    "11111111",
    "10011001",
    "10000001",
    "10000001",
    "01000010",
    "00100100",
    "00011000",
    "00000000"
];

// Send frames to Arduino
Meteor.methods({
    'play': function(data) {

        if(Meteor.isServer) {

            serverData = data;

        }

    }
});
~~~

##### server/blink.js

The last thing to do is to catch this data in `blink.js`. We do this by making a loop with timeout and sending the `serverData` variable to the Arduino.

~~~javascript
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
~~~

## Result

If everything went okay you should now be able to click the button at `http://localhost:3000/` and see an **M** appear on your LED matrix. 

❤ - Meteor