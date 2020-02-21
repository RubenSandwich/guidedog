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
Object.defineProperty(exports, "__esModule", { value: true });
var parse5_1 = require("parse5");
var utilities_1 = require("./utilities");
var types_1 = require("./types");
exports.guideDog = function (html, options) {
    var defaults = {
        filterType: types_1.GuideDogFilter.Headers,
        sourceCodeLoc: false,
    };
    var optionsWithDefaults = __assign(__assign({}, defaults), options);
    var document = parse5_1.parseFragment(html, {
        sourceCodeLocationInfo: optionsWithDefaults.sourceCodeLoc,
    });
    var tree = parseIntoAccessibleNodes(document, optionsWithDefaults);
    return tree;
};
var parseIntoAccessibleNodes = function (node, options, accessibleNodes) {
    var _a;
    if (accessibleNodes === void 0) { accessibleNodes = []; }
    var filterType = options.filterType, sourceCodeLoc = options.sourceCodeLoc;
    if (!node.childNodes) {
        return accessibleNodes;
    }
    var _b = utilities_1.filterTypeMap(filterType, (_a = {},
        _a[types_1.GuideDogFilter.Headers] = function () {
            if (!utilities_1.isHeading(node.tagName)) {
                return;
            }
            var level = utilities_1.getHeadingLevel(node.tagName);
            var textNode = utilities_1.getFirstChild(node);
            var insertPath = utilities_1.getHeaderInsertPath(accessibleNodes, level);
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
            return { newNode: newNode, insertPath: insertPath };
        },
        _a[types_1.GuideDogFilter.Links] = function () {
            var _a;
            if (!utilities_1.isLink(node.tagName)) {
                return;
            }
            if (((_a = utilities_1.htmlAttributesToObject(node.attrs)) === null || _a === void 0 ? void 0 : _a.href) == null) {
                return;
            }
            var textNode = utilities_1.getFirstChild(node);
            var insertPath = utilities_1.getNextTopLevelInsertPath(accessibleNodes);
            var newNode = {
                role: 'link',
                name: textNode.value,
                focusable: true,
            };
            if (sourceCodeLoc) {
                newNode.sourceCodeLoc = {
                    startOffset: node.sourceCodeLocation.startOffset,
                    endOffset: node.sourceCodeLocation.endOffset,
                };
            }
            return { newNode: newNode, insertPath: insertPath };
        },
        _a)), newNode = _b.newNode, insertPath = _b.insertPath;
    if (newNode) {
        return utilities_1.upsertNode(accessibleNodes, newNode, insertPath);
    }
    var newAccessibleNodes = accessibleNodes;
    node.childNodes.forEach(function (childNode) {
        newAccessibleNodes = parseIntoAccessibleNodes(childNode, options, newAccessibleNodes);
    });
    return newAccessibleNodes;
};
//# sourceMappingURL=guideDog.js.map