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
    if (options === void 0) { options = {
        filterType: GuideDogFilter.Headers,
    }; }
    var document = parse5_1.parseFragment(html, {});
    return parseIntoAccessibleNodes(document, options.filterType);
};
var getFirstChild = function (node) {
    return node.childNodes[0];
};
var parseIntoAccessibleNodes = function (node, filterType, accessibleNodes) {
    if (accessibleNodes === void 0) { accessibleNodes = []; }
    if (!node.childNodes) {
        return accessibleNodes;
    }
    if (isHeading(node.tagName)) {
        var level = getHeadingLevel(node.tagName);
        var textNode = getFirstChild(node);
        var insertIndex = exports.getHeaderInsertIndex(accessibleNodes, level);
        var newNode = {
            role: 'heading',
            name: textNode.value,
            level: level,
            focusable: false,
        };
        return exports.upsertNode(accessibleNodes, newNode, insertIndex);
    }
    var newAccessibleNodes = accessibleNodes;
    node.childNodes.forEach(function (childNode) {
        newAccessibleNodes = parseIntoAccessibleNodes(childNode, filterType, newAccessibleNodes);
    });
    return newAccessibleNodes;
};
var isHeading = function (nodeTagName) {
    return /^h[1-6]/.test(nodeTagName);
};
var getHeadingLevel = function (nodeTagName) {
    return parseInt(nodeTagName.match(/[1-6]/)[0], 10);
};
exports.getHeaderInsertIndex = function (accessibleNodes, insertHeaderLevel) {
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
    ], exports.getHeaderInsertIndex(lastNode.children, insertHeaderLevel));
};
exports.upsertNode = function (accessibleNodes, node, indexPath) {
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
        __assign(__assign({}, currentNode), { children: exports.upsertNode(currentNode.children || [], node, indexPath.slice(1)) })
    ], accessibleNodes.slice(insertIndex + 1));
};
//# sourceMappingURL=guideDog.js.map