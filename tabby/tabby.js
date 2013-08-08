/* 
 Tabby - simplified tabbing, using ajax and jquery

*/

// This is the initial function to call that populates the given container with
// tabs and panes corresponding to the given list

Tabby = function(container,options){

  this.container = container;
  this.tabs = options.tabs;
  this.defaulttab = options.defaulttab;
  this.currentpane = null;
  this.doslide = options.doslide;
  this.hotkeys = options.hotkeys;

  if (this.hotkeys) {
    $("body").bind("keypress", function(event) {

      var key = event.which;

      // 'n' or 'l' moves to next tab
      if ((key === 110) || (key === 108)){ return showNext(); }

      // 'p' or 'h' moves to previous tab
      if ((key === 112) || (key === 104)){ return showPrevious(); }

    });
  };

  $("#" + this.container).addClass("tabby");
  // Create tabs
  for (i in this.tabs){
    var tabid = phraseToId(i);
    var tab = document.createElement("span");
    tab.setAttribute("id","tab-" + tabid);
    tab.setAttribute("class","tab");
    tab.setAttribute("onclick","showpane('" + tabid + "'," + (this.doslide == true?"true":"false") + ")");
    tab.innerHTML = i;
    document.getElementById(this.container).appendChild(tab);
  }

  // Create panes
  for (i in this.tabs){
    var paneid = phraseToId(i);
    var pane = document.createElement("div");
    pane.setAttribute("id",paneid);
    pane.setAttribute("class","pane");
    document.getElementById(this.container).appendChild(pane);
  }

  //Load default tab (if specified)
  if (this.defaulttab){
    showpane(this.defaulttab);
  }
  
};

function showpane(paneid,doslide) {

  this.currentpane = $("#" + paneid).first();
  $("#" + this.container + " .pane").hide();

  // Fetch the contents of the tab we want to show
  $.ajax({

    url: this.tabs[$("#tab-" + paneid)[0].innerHTML],

    method:"get",

    success: function(response,status,xhr){
      $("#" + paneid)[0].innerHTML = response;
    },

    error: function(xhr){
      $("#" + paneid)[0].innerHTML = xhr.responseText;
    }

  });

  if (doslide){
    this.currentpane.slideDown();
  } else {
    this.currentpane.show();
  }
  // Indicate which tab is active
  $("#" + this.container + " .tab").removeClass("active");
  $("#tab-" + paneid).addClass("active");
}

function phraseToId(phrase){
    // Needed for converting tab names into valid HTML identifiers.
    var idstring = phrase.replace(" ","-");
    idstring = idstring.replace("/","-slash-");
    return idstring;
}

function keypressed(event){

}

function showNext(){

  var nextpane =  this.currentpane.next(".pane")[0] || $(".pane").first()[0];

  showpane(nextpane.id);

}

function showPrevious(){

  var prevpane = this.currentpane.prev(".pane")[0]  || $(".pane").last()[0];

  showpane(prevpane.id);

}
