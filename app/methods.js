serverData = [
    "01100110",
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