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
        require.async("montage/ui/component");
    }, function() {
        Inspector.run(function() {
            return require("montage/ui/component").__root__;
        }, function(component) {
            if (component == null) {
                Inspector.log("WARNING: root component NOT found!");
            } else {
                Inspector.debug("root component found!");
            }
        });
    });
})();
