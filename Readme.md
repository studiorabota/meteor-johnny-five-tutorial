# Control your Arduino with a web app via Meteor and Johnny Five 

## Chapter 1: Meteor and Johnny Five

In the first chapter we will set up Meteor with Johnny Five and make an LED blink. Blink! Blink! 

- Level: Intermediate
- Skillset needed: A bit of JS and Node will help
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

### Adding Jonny Five to your Meteor app

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

~~~json
{
	"serialport": "2.0.5",
  	"johnny-five": "0.9.10"
}
~~~

### Meteor

Create a `server` folder and add a JS file, name it blink.js. Meteor will automatically pick it up.

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

### Arduino

Install the [Arduino IDE](https://www.arduino.cc/en/Main/Software) and connect your Arduino. Check the terminal, this will now show the port number.. nerd delight.

~~~terminal
$: Connected /dev/cu.usbserial-****
~~~

We now have to upload StandardFirmata to the Arduino. StandardFirmata makes it possible for libraries like Johnny Five to communicate. 

Open the Arduino IDE:
  
1. `File -> Examples -> Firmata -> StandardFirmata` 
2. `Sketch -> Upload`

Place a LED in port 13 and ground - [example](https://raw.githubusercontent.com/rwaldron/johnny-five/master/assets/led-blink.gif). It will start blinking because of the two lines below in Blink.js.

~~~javascript
var led = new JohnnyFive.Led(13);

led.blink(500);
~~~

## Chapter 2: LED Matrix

In this chapter we will control a 8 dot led matrix via a web interface.

... Online soon ...  