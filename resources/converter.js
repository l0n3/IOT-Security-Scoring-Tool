$(function() {
  var getLabel = function(current) {
    return current.help ? current.label + ' <br><small>' + current.help + '</small>' :
      current.label;
  };
  var optionList = function(name) {
    return function(current, depth) {
      var dform = {
        caption: getLabel(current),
        type: name,
        options: {},
        name: current.name ? current.name : current.label,
      };
      $.each(current.values, function(index, value) {
        dform.options[value] = value;
      });
      return dform;
    }
  };
  var converters = {
    default: function(current, depth) {
      return {
        type: 'div',
        class: 'form-group',
        html: {
          caption: getLabel(current),
          type: current.type,
          name: current.name ? current.name : current.label,
          class: 'form-control'
        }
      };
    },
    section: function(current, depth) {
      var dform = {
        caption: getLabel(current),
        type: 'fieldset',
        name: current.name ? current.name : current.label,
        id: current.id,
        html: []
      };
      $.each(current.questions || [], function(index, question) {
        dform.html.push(convert(question, depth + 1));
      });

      return dform;
    },
    single: optionList('radiobuttons'),
    multi: optionList('checkboxes')
  };

  var convert = function(data, depth) {
    var converter = converters[data.type];
    converter = converter || converters.default;
    return converter(data, depth ? depth + 1 : 0);
  };

  $.getJSON('questions.json').then(function(data) {
    var questions = data.questions;

    $('#heading').append(data.heading);

    $.each(questions, function(index, question) {
      $('#checklist').dform(convert(question))
    });

    $('[type="checkbox"]').each(function() {
      $(this).next().prepend($(this)).wrap('<div class="checkbox">');
    });

    $('[type="radio"]').each(function() {
      $(this).next().prepend($(this)).wrap('<div class="radio">');
    });

    $('#checklist').append("<div class='text-center'><input class='btn btn-lg btn-primary' type='submit' value='Submit' /></div>");
    
  });

  $('body').on('submit', 'form', function(ev){
    var data = $('form').formParams();
    ev.preventDefault();
    renderScore(data);
  })

  var answers = {
    "Eco-Resp":0.5,
    "Eco-Project":0.5,
    "mem1":0.5,
    "mem2":0.5,
    "phy-deb":0.5,
    "phy-port":0.5,
    "phy-rev":0.5,
    "firm1":0.5,
    "firm2":0.5,
    "firm3":0.5,
    "firm4":0.5,
    "firm5":0.5,
    "firm6":0.5,
    "firm7":0.5,
    "Network1":0.5,
    "Network2":0.5,
    "Network3":0.5,
    "Network4":0.5,
    "Network5":0.5,
    "Network6":0.5,
    "Network7":0.5,
    "Network8":0.5,
    "Network9":0.5,
    "Network10":0.5,
    "admin1":0.5,
    "admin2":0.5,
    "admin3":0.5,
    "loc-data-1":0.5,
    "loc-data-2":0.5,
    "loc-data-3":0.5,
    "web1":0.5,
    "web2":0.5,
    "web3":0.5,
    "web4":0.5,
    "web5":0.5,
    "web6":0.5,
    "web7":0.5,
    "web8":0.5,
    "web9":0.5,
    "web10":0.5,
    "web11":0.5,
    "web12":0.5,
    "thirdparty1":0.5,
    "thirdparty2":0.5,
    "update-plan":0.5,
    "update-pack":0.5,
    "mobile-default-passwd": 0.5,
    "mobile-strong-passwd": 0.5,
    "mobile-expire-passwd": 0.5,
    "mobile-account-lockout": 0.5,
    "mobile-2fact-auth" :0.5,
    "ecocom1":0.5,
    "ecocom2":0.5,
    "ecocom3":0.5
  }

  var getScore = function(data){
    var total = 0, count = 0;
    for (var key in answers){
      total += answers[key];
      count++;
    }
    var points = 0;
    for(var key in data) {
      if(answers[key] && data[key] !== "none" && data[key] !== "No"){
        points+=answers[key];
      }
    }
    return parseInt(points/total*100, 10);
  }

  var renderScore = function(data){
    var score = getScore(data);
    $(".links").remove();
    $('#checklist').html(can.view("resources/doughnut.mustache")({
        score: score
    }));
    $("#doughnutChart").drawDoughnutChart([
      { 
        title: "Yes, beyond your wildest dreams :)",
        value : score,  
        color: "#4BA658" 
      },
      { 
        title: "No, burning flames are in your future :(",
        value:  100-score,   
        color: "#D93B48" 
      }
    ], {

    });
  // $('#checklist').append("<div class='answers'>"+JSON.stringify(data)+"</div>");
  }
});
