/** Created by msyk on 2016/09/18.
 * This file can be started with node.js.
 * acorn and escodegen have to be installed by npm command not download.
 */
var escodegen = require("escodegen");
var fs = require('fs');
fs.readFile('../INTER-Mediator/Adapter_DBServer.js', 'utf8', function (err, text) {
    if (err) {
        console.log(err);
    } else {
        analyzeCode(text);
    }
});

var requestVarName = "";
function analyzeCode(text) {
    JSModifier.addBlock('Identifier', function (node) {
        var lastElement, i, elem;
        if (node.name == "XMLHttpRequest") {
            lastElement = JSModifier.stack[JSModifier.stack.length - 1];
            if (lastElement.type == "NewExpression") {
                for (i = JSModifier.stack.length - 2 ; i >= 0 ; i--)    {
                    elem = JSModifier.stack[i];
                    if (elem.type == "AssignmentExpression")  {
                        requestVarName = elem.left.name;
                        console.log(requestVarName);
                        break;
                    }
                }
            }
        }
    });
    JSModifier.addBlock('MemberExpression', function (node) {
        var lastElement;
        if (node.object.name == requestVarName && node.property.name=="open") {
            lastElement = JSModifier.stack[JSModifier.stack.length - 1];
            if (lastElement.type == "CallExpression" && lastElement.arguments.length >= 3) {
                if (lastElement.arguments[2].value === true)    {
                    console.log("Synchronized Communication Detected");
                }
            }
        }
    });
    JSModifier.addBlock('FunctionExpression', function (node) {
        if (requestVarName.length > 0) {
            requestVarName = "";
        }
    });
    JSModifier.parseCode(text);
}

var JSModifier = {
    acorn: require("acorn"),
    depth: 0,
    label: "",
    stack: [],

    info: {
        'VariableDeclaration': {display: null, iterate: ["declarations"]},
        'VariableDeclarator': {display: null, iterate: ["id", "init"]},
        'Property': {display: null, iterate: ["value"]},
        'ExpressionStatement': {display: null, iterate: ["expression"]},
        'AssignmentExpression': {display: null, iterate: ["left", "right"]},
        'CallExpression': {display: null, iterate: ["callee", "property", "arguments"]},
        'Identifier': {display: ["name"], iterate: null},
        'ObjectExpression': {display: null, iterate: ["properties"]},
        'Literal': {display: ["value"], iterate: null},
        'ArrayExpression': {display: null, iterate: ["elements"]},
        'UnaryExpression': {display: null, iterate: ["argument"]},
        'FunctionExpression': {display: null, iterate: ["params", "body"]},
        'BlockStatement': {display: null, iterate: ["body"]},
        'MemberExpression': {display: null, iterate: ["object", "property"]},
        'ReturnStatement': {display: null, iterate: ["argument"]},
        'ForStatement': {display: null, iterate: ["init", "tes", "update", "body"]},
        'IfStatement': {display: null, iterate: ["test", "consequent"]},
        'BinaryExpression': {display: ["operator"], iterate: ["left", "right"]},
        'UpdateExpression': {display: ["operator"], iterate: ["argument"]},
        'ThisExpression': {display: null, iterate: null},
        'ThrowStatement': {display: null, iterate: ["argument"]},
        'ForInStatement': {display: null, iterate: ["left", "right", "body"]},
        'NewExpression': {display: null, iterate: ["callee", "arguments"]},
        'ConditionalExpression': {display: null, iterate: ["test", "consequent", "alternate"]},
        'FunctionDeclaration': {display: null, iterate: ["id", "params", "body"]},
        'LogicalExpression': {display: ["operator"], iterate: ["left", "right"]},
        'BreakStatement': {display: null, iterate: null},
        'TryStatement': {display: null, iterate: ["block", "handler", "finalizer"]},
        'CatchClause': {display: null, iterate: ["param", "body"]},
        'WhileStatement': {display: null, iterate: ["test", "body"]},
        'SwitchStatement': {display: null, iterate: ["discriminant", "cases"]},
        'SwitchCase': {display: null, iterate: ["test", "consequent"]}
    },

    addBlock: function (type, block) {
        if (JSModifier.info[type]) {
            JSModifier.info[type]["execBlock"] = block;
        }
    },

    parseCode: function (text) {
        JSModifier.iterateNodes(JSModifier.acorn.parse(text).body, "");
    },

    iterateNodes: function (node, label) {
        var i, j, n, nodes, disp, iter, addInfo, block, labelStr, indentStr;

        if (!node) {
            return;
        }
        JSModifier.depth++;
        indentStr = Array(JSModifier.depth).join('-');
        labelStr = label ? ("[" + label + "]") : "";
        nodes = Array.isArray(node) ? node : [node];
        for (i = 0; i < nodes.length; i++) {
            n = nodes[i];
            if (JSModifier.info[n.type]) {
                disp = JSModifier.info[n.type].display;
                iter = JSModifier.info[n.type].iterate;
                block = JSModifier.info[n.type].execBlock;
                addInfo = "";
                if (disp) {
                    for (j = 0; j < disp.length; j++) {
                        addInfo += "(" + n[disp[j]] + ")";
                    }
                }
                console.log(indentStr + labelStr + n.type + addInfo);
                if (iter) {
                    for (j = 0; j < iter.length; j++) {
                        JSModifier.stack.push(n);
                        JSModifier.iterateNodes(n[iter[j]], iter[j]);
                        JSModifier.stack.pop();
                    }
                }
                if (block) {
                    block(n);
                }
            } else {
                console.log(Array(JSModifier.depth).join('-') + n.type + '####### NOT IMPLEMENTED TYPE #######');
            }
        }
        JSModifier.depth--;
    }
};//    var codes = escodegen.generate(result);//      console.log(codes);