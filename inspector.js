var DEBUG = false;
var Inspector = {};

Inspector.log = function(message) {
    chrome.devtools.inspectedWindow.eval("console.log('[montage-inspector] " + message + "');");
}

Inspector.debug = function(message) {
    if (DEBUG) {
        this.log.apply(this, arguments);
    }
}

Inspector.debug("LOADED " + (new Date()));

Inspector.run = function(funktion, callback) {
    chrome.devtools.inspectedWindow.eval("("+funktion.toString()+")()", callback);
}

;(function getRootComponent() {
    Inspector.run(function() {
        montageRequire.async("ui/component");
    }, function() {
        Inspector.run(function() {
            return !!montageRequire("ui/component").__root__;
        }, function(component) {
            if (component) {
                Inspector.log("WARNING: root component NOT found!");
            } else {
                Inspector.debug("root component found!");
            }
        });
    });
})();
