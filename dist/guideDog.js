"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var parse5_1 = require("parse5");
var GuideDogFilter;
(function (GuideDogFilter) {
    GuideDogFilter[GuideDogFilter["Headers"] = 0] = "Headers";
})(GuideDogFilter = exports.GuideDogFilter || (exports.GuideDogFilter = {}));
exports.guideDog = function (html, options) {
    var defaults = {
        filterType: GuideDogFilter.Headers,
        sourceCodeLoc: false,
    };
    var optionsWithDefaults = __assign(__assign({}, defaults), options);
    var document = parse5_1.parseFragment(html, {
        sourceCodeLocationInfo: optionsWithDefaults.sourceCodeLoc,
    });
    var tree = parseIntoAccessibleNodes(document, optionsWithDefaults);
    return tree;
};
var getFirstChild = function (node) {
    return node.childNodes[0];
};
var parseIntoAccessibleNodes = function (node, options, accessibleNodes) {
    if (accessibleNodes === void 0) { accessibleNodes = []; }
    var filterType = options.filterType, sourceCodeLoc = options.sourceCodeLoc;
    if (!node.childNodes) {
        return accessibleNodes;
    }
    if (isHeading(node.tagName)) {
        var level = getHeadingLevel(node.tagName);
        var textNode = getFirstChild(node);
        var insertIndex = getHeaderInsertIndex(accessibleNodes, level);
        var newNode = {
            role: 'heading',
            name: textNode.value,
            level: level,
            focusable: false,
        };
        if (sourceCodeLoc) {
            newNode.sourceCodeLoc = {
                startOffset: node.sourceCodeLocation.startOffset,
                endOffset: node.sourceCodeLocation.endOffset,
            };
        }
        return upsertNode(accessibleNodes, newNode, insertIndex);
    }
    var newAccessibleNodes = accessibleNodes;
    node.childNodes.forEach(function (childNode) {
        newAccessibleNodes = parseIntoAccessibleNodes(childNode, options, newAccessibleNodes);
    });
    return newAccessibleNodes;
};
var isHeading = function (nodeTagName) {
    return /^h[1-6]/.test(nodeTagName);
};
var getHeadingLevel = function (nodeTagName) {
    return parseInt(nodeTagName.match(/[1-6]/)[0], 10);
};
var getHeaderInsertIndex = function (accessibleNodes, insertHeaderLevel) {
    if (accessibleNodes.length === 0) {
        return [0];
    }
    var lastNodeIndex = accessibleNodes.length - 1;
    var lastNode = accessibleNodes[accessibleNodes.length - 1];
    if (lastNode.level >= insertHeaderLevel) {
        return [lastNodeIndex + 1];
    }
    else if (lastNode.children == null) {
        return [lastNodeIndex, 0];
    }
    return __spreadArrays([
        lastNodeIndex
    ], getHeaderInsertIndex(lastNode.children, insertHeaderLevel));
};
var upsertNode = function (accessibleNodes, node, indexPath) {
    if (accessibleNodes.length == 0) {
        return [node];
    }
    var insertIndex = indexPath[0];
    if (indexPath.length === 1) {
        return __spreadArrays(accessibleNodes.slice(0, insertIndex), [
            node
        ], accessibleNodes.slice(insertIndex));
    }
    var currentNode = accessibleNodes[insertIndex];
    return __spreadArrays(accessibleNodes.slice(0, insertIndex), [
        __assign(__assign({}, currentNode), { children: upsertNode(currentNode.children || [], node, indexPath.slice(1)) })
    ], accessibleNodes.slice(insertIndex + 1));
};
exports.testSuite = {
    upsertNode: upsertNode,
    getHeaderInsertIndex: getHeaderInsertIndex,
};
//# sourceMappingURL=guideDog.js.map