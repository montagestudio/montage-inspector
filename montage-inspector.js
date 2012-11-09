function getMontageComponentProperties() {
    var properties = Object.create(null),
        component = $0.controller;
        propertyNames = [
            "ownerComponent",
            "parentComponent",
            "childComponents",
            "_template",
            "_element",
            "_needsDraw",
            "_canDraw",
            "_canDrawGate",
            "_blockDrawGate"
        ];

    for (var i = 0, propertyName; propertyName = propertyNames[i]; i++) {
        properties[propertyName] = component[propertyName];
    }

    properties.prototype = component._montage_metadata.moduleId + "[" + component._montage_metadata.objectName + "]";

    return properties;
}

function getMontageComponentTree(rootComponent) {
    if (!rootComponent) {
        rootComponent = require('montage/ui/component').__root__;
    }

    var childComponents = rootComponent.childComponents;

    if (childComponents.length > 0) {
        var components = Object.create(null);

        for (var i = 0, component; component = childComponents[i]; i++) {
            components[component._montage_metadata.label] = getMontageComponentTree(component);
        }

        return components;
    }
}

chrome.devtools.panels.elements.createSidebarPane(
    "Montage Component",
    function (sidebar) {
        function updateMontageComponentProperties() {
            chrome.devtools.inspectedWindow.eval("$0.controller", function(controller) {
                if (controller) {
                    sidebar.setExpression("(" + getMontageComponentProperties.toString() + ")()");
                } else {
                    sidebar.setObject();
                }

            })
        }
        chrome.devtools.panels.elements.onSelectionChanged.addListener(updateMontageComponentProperties);
    }
);

chrome.devtools.panels.elements.createSidebarPane(
    "Montage Component Tree",
    function (sidebar) {
        function updateComponentTree() {
            sidebar.setExpression("(" + getMontageComponentTree.toString() + ")()");
        }
        updateComponentTree();
    }
);