
function onClickHandler(info, tab) {
    // console.log("item " + info.menuItemId + " was clicked");
    // console.log("info: " + JSON.stringify(info));
    console.log("info.pageUrl: " + info.pageUrl);
    console.log("info.selectionText: " + info.selectionText);

    var xhr = new XMLHttpRequest();

    // TODO: put the host and port to config
    xhr.open("POST", "http://localhost:3000/sparkles");
    xhr.setRequestHeader("content-type","application/json");
    xhr.send(JSON.stringify({"url": info.pageUrl, "sparkle": info.selectionText, "author": "Mark Twin"}));

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            console.log(xhr.responseText);
        }
    }
}

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