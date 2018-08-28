
// Create the following HTML with DOM operations:
//
// #START of HTML
/*
<!-- The Modal -->
<div id="myModal" class="modal">

  <!-- Modal content -->
  <div class="modal-content">
    <div class="modal-header">
      <span class="close">&times;</span>
      <h2>Modal Header</h2>
    </div>
    <div class="modal-body">
      <p>Some text in the Modal Body</p>
      <p>Some other text...</p>
    </div>
    <div class="modal-footer">
      <h3>Modal Footer</h3>
    </div>
  </div>

</div>
 */
// #END of HTML

modalDiv = document.createElement("div");
modalDiv.setAttribute("style", "display: block; /* Display by default */ position: fixed; /* Stay in place */ z-index: 999999; /* Sit on top */ padding-top: 100px; /* Location of the box */ left: 0; top: 0; width: 100%; /* Full width */ height: 100%; /* Full height */ overflow: auto; /* Enable scroll if needed */ background-color: rgb(0,0,0); /* Fallback color */ background-color: rgba(0,0,0,0.4); /* Black w/ opacity */");

modalContentDiv = document.createElement("div");

var showFrames = [
    {
        transform: 'translateY(-300px)',
        opacity: 0
    },
    {
        transform: 'translateX(0)',
        opacity: 1
    }
];

modalContentDiv.setAttribute("style", "position: relative; background-color: #fefefe; margin: auto; padding: 0; border: 1px solid #888; width: 80%; box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19);");

// Animate to display
modalContentDiv.animate(showFrames, {
    duration: 400
})

modalContentHeaderDiv = document.createElement("div");
modalContentHeaderDiv.setAttribute("style", "padding: 2px 16px; background-color: #5cb85c; color: white;");

modalContentHeaderSpan = document.createElement("span");
modalContentHeaderSpan.setAttribute("style", "color: white; float: right; font-size: 28px; font-weight: bold;");
modalContentHeaderSpan.innerHTML = "&times;";

modalContentHeaderDiv.appendChild(modalContentHeaderSpan);

modalContentHeaderText = document.createElement("strong");
modalContentHeaderText.innerHTML = "Modal Header";

modalContentHeaderDiv.appendChild(modalContentHeaderText);

modalContentDiv.appendChild(modalContentHeaderDiv);

modalContentBodyDiv = document.createElement("div");
modalContentBodyDiv.setAttribute("style", "padding: 2px 16px;");

modalContentBodyItem_1 = document.createElement("div");
modalContentBodyItem_1.innerHTML = "sparkles_payload.url";

modalContentBodyDiv.appendChild(modalContentBodyItem_1);

modalContentBodyItem_2 = document.createElement("div");
modalContentBodyItem_2.innerHTML = "Some other text ...";

modalContentBodyDiv.appendChild(modalContentBodyItem_2);

modalContentBodyItem_3 = document.createElement("div");
modalContentBodyItem_3.innerHTML = "";

modalContentBodyDiv.appendChild(modalContentBodyItem_3);

modalContentDiv.appendChild(modalContentBodyDiv);

modalContentFooterDiv = document.createElement("div");
modalContentFooterDiv.setAttribute("style", "padding: 2px 16px; background-color: #5cb85c; color: white;");

modalContentFooterText = document.createElement("strong");
modalContentFooterText.innerHTML = "Modal Footer";

modalContentFooterDiv.appendChild(modalContentFooterText);

modalContentFooterButton = document.createElement("button");
modalContentFooterButton.setAttribute("style", "float: right; font-weight: bold; background-color: #5cb85c; color: white;");
modalContentFooterButton.innerHTML = "Save";

modalContentFooterDiv.appendChild(modalContentFooterButton);

modalContentDiv.appendChild(modalContentFooterDiv);

modalDiv.appendChild(modalContentDiv);

document.body.appendChild(modalDiv);

// When the user clicks on <span> (x), close the modal
modalContentHeaderSpan.onclick = function() {
    modalDiv.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modalDiv) {
        modalDiv.style.display = "none";
    }
};

modalContentHeaderSpan.addEventListener("mouseover", function( event ) {
    // highlight the mouseover target
    event.target.style.backgroundColor = "coral";
}, false);

modalContentHeaderSpan.addEventListener("mouseout", function( event ) {
    // highlight the mouseout target
    event.target.style.backgroundColor = "#5cb85c";
}, false);


// Receive message from extension
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    // Handle message.
    if (message.type == "FROM_SPARKLE_EXTENSION" && message.status == "SELECTED_FROM_PAGE" && message.payload) {
        modalContentBodyItem_1.innerHTML = message.payload.url
        modalContentBodyItem_2.innerHTML = message.payload.sparkle
        modalContentBodyItem_3.innerHTML = message.payload.author
    }
});

modalContentFooterButton.onclick = function(event) {

    var payload = {"url": modalContentBodyItem_1.innerHTML, "sparkle": modalContentBodyItem_2.innerHTML, "author": modalContentBodyItem_3.innerHTML}
    chrome.runtime.sendMessage({type: "FROM_SPARKLE_CLIENT", status: "SAVE_CONTENT_READY", payload: payload}, function(response) {
        console.log("Response: ", response);
        if (response.status == "DONE") {
            modalDiv.style.display = "none";
        }
    });
}

// imageElement = document.createElement("img");
// imageElement.src = chrome.extension.getURL("spinner_progress.gif");
