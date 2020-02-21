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
var types_1 = require("./types");
exports.isHeading = function (nodeTagName) {
    return /^h[1-6]/.test(nodeTagName);
};
exports.isLink = function (nodeTagName) {
    return nodeTagName === 'a';
};
exports.getFirstChild = function (node) {
    return node.childNodes[0];
};
exports.filterTypeMap = function (filter, filterTypeMap) {
    var _a, _b;
    switch (filter) {
        case types_1.GuideDogFilter.Headers:
            return (_a = filterTypeMap[types_1.GuideDogFilter.Headers]()) !== null && _a !== void 0 ? _a : {};
        case types_1.GuideDogFilter.Links:
            return (_b = filterTypeMap[types_1.GuideDogFilter.Links]()) !== null && _b !== void 0 ? _b : {};
        default:
            var _exhaustiveCheck = filter;
    }
};
exports.htmlAttributesToObject = function (attrs) {
    return attrs.reduce(function (obj, attr) {
        obj[attr.name] = attr.value;
        return obj;
    }, {});
};
exports.getHeadingLevel = function (nodeTagName) {
    return parseInt(nodeTagName.match(/[1-6]/)[0], 10);
};
exports.getHeaderInsertPath = function (accessibleNodes, insertHeaderLevel) {
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
    ], exports.getHeaderInsertPath(lastNode.children, insertHeaderLevel));
};
exports.getNextTopLevelInsertPath = function (accessibleNodes) {
    return [accessibleNodes.length];
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
//# sourceMappingURL=utilities.js.map