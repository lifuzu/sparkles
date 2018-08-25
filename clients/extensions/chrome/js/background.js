
function onClickHandler(info, tab) {

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {

        var payload = { "url": info.pageUrl, "sparkle": info.selectionText, "author": "Mark Twin"};

        // Send the payload to client_modal for display
        chrome.tabs.executeScript(tabs[0].id, {
            file: "js/client_modal.js"
        }, function() {
            chrome.tabs.sendMessage(tabs[0].id, { type: "FROM_SPARKLE_EXTENSION", status: "SELECTED_FROM_PAGE", payload: payload });
        });
    });
}

function onMessageHandler(request, sender, sendResponse) {
    if (request.type == "FROM_SPARKLE_CLIENT" && request.status == "SAVE_CONTENT_READY" && request.payload) {
        var xhr = new XMLHttpRequest();

        var payload = request.payload
        // TODO: put the host and port to config
        xhr.open("POST", "http://localhost:3000/sparkles");
        xhr.setRequestHeader("content-type","application/json");
        xhr.send(JSON.stringify({"url": payload.url, "sparkle": payload.sparkle, "author": payload.author}));

        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                console.log(xhr.responseText);
                sendResponse({status: "DONE"});
            }
        }
        return true;
    }
}

chrome.runtime.onMessage.addListener(onMessageHandler);

chrome.contextMenus.onClicked.addListener(onClickHandler);

chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({color: '#3aa757'}, function() {
        console.log("The color is green.");
    });

    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [new chrome.declarativeContent.PageStateMatcher({
                pageUrl: {hostEquals: 'developer.chrome.com'},
            })],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });

    // create context menu
    const contexts = ["selection"];
    for (var i = 0; i < contexts.length; i++) {
        var context = contexts[i]
        chrome.contextMenus.create({"title": "Share a Sparkle", "contexts":[context], "id": "context_" + context}, function() {
            if (chrome.extension.lastError) {
                console.log("ERROR: " + chrome.extension.lastError.message)
            }
        });
    }
});