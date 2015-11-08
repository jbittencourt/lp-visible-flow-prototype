var currentworld = null;
var workspace = null;
var myInterpreter = null;

function getCurrentMicroworld() {
  return currentworld;
}

//$(document).ready(function() {
$(function() {

  $('#runButton').click( function() {
    currentworld.reset();
    lpRunCode();

    var runFrames = currentworld.getTotalTime();

    $("#programTimeSlider").slider( {
      "max": runFrames,
      "disaled": false
    });
    console.log("Set slider to max "+runFrames.toString());
  });


  $("#programTimeSlider").slider({
    "step": 1,
    "min": 1,
    "disaled": false,
    "slide": slideTime
  });



  initUI();
});

function initUI() {

  workspace = Blockly.inject('blocklyDiv',
     {media: 'blockly/media/',
      toolbox: document.getElementById('toolbox')});

  Blockly.Xml.domToWorkspace(workspace,  document.getElementById('demo') );

  workspace.addChangeListener(lpParseCode);

  //init the turtle geometry microworldDiv
  var canvas_element = document.getElementById("stage");

  currentworld = new Microworld(canvas_element, canvas_element.width, canvas_element.height);
  currentworld.penup();
}

function slideTime(event, ui) {
    currentworld.setPlayTime(ui.value-1);
    lpHighlighBlockTime(ui.value-1);
    currentworld.refresh();
}
