var currentworld = null;
var workspace = null;
var myInterpreter = null;

function getCurrentMicroworld() {
  return currentworld;
}

function setStepsLabel(steps) {
  var stepsText = $("#stepsText");

  if(stepsText!=null) {
    stepsText.text(steps.toString()+" passo");
    if(steps>1) {
      stepsText.append("s");
    }
  }
}

function setCurrentStepLabel(steps) {
  var stepsText = $("#stepsText");

  if(stepsText!=null) {
    stepsText.text("passo "+steps.toString());
  }
}

function isTimeVisible() {
  el = $("#isTimeVisible");

  if(el!=null) {
    return el.prop('checked');
  }

  return false;
}

//$(document).ready(function() {
$(function() {

  $('#runButton').click( function() {
    currentworld.reset();

    currentworld.setTimeVisibleMode(isTimeVisible());

    lpRunCode();
    var runFrames = currentworld.getTotalTime();

    currentworld.setPlayTime(runFrames-1);

    setStepsLabel(runFrames);


    $("#programTimeSlider").slider( {
      "max": runFrames,
      "value": runFrames,
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

  $("#isTimeVisible").click(function() {
    currentworld.setTimeVisibleMode(isTimeVisible());
  })

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
    setCurrentStepLabel(ui.value);

    currentworld.refresh();
}
