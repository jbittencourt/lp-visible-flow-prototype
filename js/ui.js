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

function executeCode() {
  console.log("Executing code.")

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
}

//$(document).ready(function() {
$(function() {

  $('#runButton').click( function() {
      executeCode();
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

  $("#save_button").click(save);
  $("#load_button").click(load)


  //this code aims to give a visual intuition about moves and angles
  // var blocklyChangingNumber = false;
  // $(document).on("mousedown mouseup mousemove",".blocklyHtmlInput", function(e) {
  //     if(!isTimeVisible) return false;
  //
  //     switch(e.type) {
  //       case "mousedown":
  //           blocklyChangingNumber = true;
  //           break;
  //       case "mousedown":
  //           blocklyChangingNumber = false;
  //           break;
  //       case "mousemove":
  //           if(blocklyChangingNumber) {
  //             var el = $(e.toElement);
  //             var currentValue = parseInt(el.val(),10);
  //
  //             console.log(currentValue);
  //             //tests if currentValue is integer
  //             if (Number.isInteger(currentValue)) {
  //               //ok, we got an int
  //               currentValue += 1;
  //               el.val(currentValue);
  //               executeCode();
  //             }
  //           }
  //           break;
  //     }
  // });

  // $(".blocklyHtmlInput").mousedown = function(e) { blocklyChangingNumber = true; }
  //
  // $(".blocklyHtmlInput").mousemove= function(e) {
  //   if(blocklyChangingNumber) {
  //     console.log(e);
  //   };
  // }
  //
  // $(".blocklyHtmlInput").mouseup = function(e) { blocklyChangingNumber = false; }


  initUI();
});

function initUI() {

  workspace = Blockly.inject('blocklyDiv',
     {media: 'blockly/media/',
      toolbox: document.getElementById('toolbox')});

  Blockly.Xml.domToWorkspace(workspace,  document.getElementById('demo') );

  workspace.addChangeListener(lpParseCode);

  //init the turtle geometry microworldDiv
  var canvasParent = $("#stageFrame");

  stage = document.createElement("CANVAS");
  stage.id = "stage";
  stage.width = canvasParent.width();
  stage.height = 350;
  canvasParent.append(stage);

  currentworld = new Microworld(stage, stage.width, stage.height);
  //currentworld.penup();
}

function slideTime(event, ui) {
    currentworld.setPlayTime(ui.value-1);
    lpHighlighBlockTime(ui.value-1);
    setCurrentStepLabel(ui.value);

    currentworld.refresh();
}


function getSavedWorldsList() {
  var worldsStr = window.localStorage.getItem("microworlds");
  var worlds = new Array();
  if(worldsStr!=null) {
    worlds = JSON.parse(worldsStr);
  }

  return worlds;
}

function getSaveMicroworld(key) {
    return JSON.parse(window.localStorage.getItem(key));
}

function save() {
    $("#save_modal_save").click(modalSave);

    if(currentworld.microworldName=="") {
      $('#save_modal').openModal();
    } else {
      saveMicrowold();
    }
}

function load() {
    var list = $("#microworlds_list"); //gets list element
    var worlds = getSavedWorldsList(); // load saved worlds

    list.empty(); //clears list

    worlds.forEach(function(item) {
       var worldInfo = getSaveMicroworld(item);

       if(worldInfo!=null) {
         var str = '<li class="collection-item">'
              + '<span class="title">' + worldInfo.name +  '</span>'
              + '<p>Autor: ' + worldInfo.author
              + '<a href="#!" class="secondary-content" data-key="'+item+'"><i class="material-icons">video_library</i></a>'
              + '</li>';

         list.append(str);
       }

    });


    $("#load_modal_button").click(modalSave);
    $('#load_modal').openModal({fullscreen: true});
}

function modalSave() {
  var input_name = $("#microworld_name");
  var input_author = $("#microworld_author");

  if(input_name.val()!="") {
    currentworld.microworldName = input_name.val();
    currentworld.microworldAuthor = input_author.val();
    saveMicrowold();
    $('#save_modal').closeModal();
  }
}

function saveMicrowold() {
  if(currentworld.microworldName!="") {
      var worlds = getSavedWorldsList();

      var key = "microwold_"+currentworld.microworldId;
      window.localStorage.setItem(key, currentworld.save()) ;

      if($.inArray(key, worlds)<0) {
        worlds.push(key);
        window.localStorage.setItem("microworlds", JSON.stringify(worlds)) ;
      }
    }
    return false;

}
