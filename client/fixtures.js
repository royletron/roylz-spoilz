Template.fixtures.fixtures = function () {
  return Fixtures.find({}, {sort: {play_at: 1}});
};

Template.fixtures.prediction_home = function(fixture) {
  if(Predictions.findOne({owner: Meteor.userId(), fixture: fixture}) != undefined)
    return Predictions.findOne({owner: Meteor.userId(), fixture: fixture}).home_score
  else
    return ''
}

Template.fixtures.prediction_away = function(fixture) {
  if(Predictions.findOne({owner: Meteor.userId(), fixture: fixture}) != undefined)
    return Predictions.findOne({owner: Meteor.userId(), fixture: fixture}).away_score
  else
    return ''
}

Template.fixtures.getAlpha2Code = function(alpha3, name) {
  if(iso.findCountryByCode(alpha3) != undefined)
    return iso.findCountryByCode(alpha3).value.toLowerCase();
  else
    if(iso.findCountryByName(name) != undefined)
      return iso.findCountryByName(name).value.toLowerCase();
    else return name.toLowerCase();
}

Template.fixtures.events({
  'click #saveButton': function(event){
    Session.get('currentUser');
    _.each(Fixtures.find({}).fetch(), function(item, idx){
      if(Predictions.findOne({owner: Meteor.userId(), fixture: item._id}) != undefined)
        Predictions.remove({_id: Predictions.findOne({owner: Meteor.userId(), fixture: item._id})._id});
      var $home = $('#'+item._id+"_home");
      var $away = $('#'+item._id+"_away");
      if(($home.val() != "") || ($away.val() != "")){
        var send = true;
        if($home.val() == "")
        {
          $home.parent().addClass('has-error');
          send = false;
        }
        if($away.val() == "")
        {
          $away.parent().addClass('has-error');
          send = false;
        }
        if(send){
          Predictions.insert({owner: Meteor.userId(), fixture: item._id, home_score: parseInt($home.val()), away_score: parseInt($away.val())});
        }
      }
      else{
        //console.log($home.parent());
        $home.parent().removeClass('has-error')
        $away.parent().removeClass('has-error')
      }
    })
  }
})