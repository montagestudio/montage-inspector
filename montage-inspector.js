function getMontageComponentProperties() {
    var properties = Object.create(null),
        component = $0.component,
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
    var name;

    if (!rootComponent) {
        rootComponent = montageRequire('ui/component').__root__;
    }

    var childComponents = rootComponent.childComponents;

    if (childComponents.length > 0) {
        var components = Object.create(null);

        for (var i = 0, component; component = childComponents[i]; i++) {
            name = component._montage_metadata.label || component._montage_metadata.objectName;
            components[name] = getMontageComponentTree(component);
        }

        return components;
    }
}

function getMontageComponentBindings() {
    var properties = Object.create(null),
        bindingDescriptors = $0.component.getBindings(),
        bindingDescriptor,
        bindingName,
        binding;

    for (var propertyName in bindingDescriptors) {
        if (bindingDescriptors.hasOwnProperty(propertyName)) {
            bindingDescriptor = bindingDescriptors[propertyName];
            binding = Object.create(null);

            if ("<-" in bindingDescriptor) {
                bindingName = propertyName + " <- " + bindingDescriptor["<-"];
            } else if ("<->" in bindingDescriptor) {
                bindingName = propertyName + " <-> " + bindingDescriptor["<->"];
            } else { // doesn't come from a serialization
                bindingName = propertyName;
            }

            binding.source = bindingDescriptor.source;
            binding.sourcePath =  bindingDescriptor.sourcePath;

            if ("converter" in bindingDescriptor) {
                binding.converter = bindingDescriptor.converter;
            }

            properties[bindingName] = binding;
        }
    }

    return properties;
}

chrome.devtools.panels.elements.createSidebarPane(
    "Montage Component",
    function (sidebar) {
        function updateMontageComponentProperties() {
            chrome.devtools.inspectedWindow.eval("!!$0.component", function(component) {
                if (component) {
                    sidebar.setExpression("(" + getMontageComponentProperties.toString() + ")()");
                } else {
                    sidebar.setObject();
                }
            })
        }

        sidebar.setObject();
        chrome.devtools.panels.elements.onSelectionChanged.addListener(updateMontageComponentProperties);
    }
);

chrome.devtools.panels.elements.createSidebarPane(
    "Montage Component Bindings",
    function (sidebar) {
        function updateMontageComponentBindings() {
            chrome.devtools.inspectedWindow.eval("!!$0.component", function(component) {
                if (component) {
                    sidebar.setExpression("(" + getMontageComponentBindings.toString() + ")()");
                } else {
                    sidebar.setObject();
                }
            })
        }
        sidebar.setObject();
        chrome.devtools.panels.elements.onSelectionChanged.addListener(updateMontageComponentBindings);
    }
);

chrome.devtools.panels.elements.createSidebarPane(
    "Montage Component Tree",
    function (sidebar) {
        function updateComponentTree() {
            sidebar.setExpression("(" + getMontageComponentTree.toString() + ")()", "root");
        }
        updateComponentTree();
    }
);