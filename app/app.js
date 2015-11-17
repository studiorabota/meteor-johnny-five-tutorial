if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.hello.helpers({
    counter: function () {
      return Session.get('counter');
    }
  });

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
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
