/**
 * Created by msyk on 2016/09/18.
 *
 * This file can be started with node.js.
 *
 * acorn and escodegen have to be installed by npm command not download.
 */

var acorn = require("acorn");
var escodegen = require("escodegen");

var fs = require('fs');

fs.readFile('../INTER-Mediator/INTER-Mediator.js', 'utf8', function (err, text) {
    if (err) {
        console.log(err);
    } else {
        parsedNode = acorn.parse(text);
        iterateNodes(parsedNode.body);
    }
});

var parsedNode;
var depth = 0;

function iterateNodes(node) {
    var i, n, nodes;
    if (!node) {
        return;
    }
    depth++;
    nodes = Array.isArray(node) ? node : [node];
    for (i = 0; i < nodes.length; i++) {
        n = nodes[i];
        switch (n.type) {
        case 'VariableDeclaration':
            console.log(Array(depth).join('-') + n.type);
            iterateNodes(n.declarations);
            break;
        case 'VariableDeclarator':
            console.log(Array(depth).join('-') + n.type);
            iterateNodes(n.id);
            iterateNodes(n.init);
            break;
        case 'Property':
            console.log(Array(depth).join('-') + n.type);
            iterateNodes(n.key);
            iterateNodes(n.value);
            break;
        case 'ExpressionStatement':
            console.log(Array(depth).join('-') + n.type);
            iterateNodes([n.expression]);
            break;
        case 'AssignmentExpression':
            iterateNodes(n.consequent);
            console.log(Array(depth).join('-') + n.type);
            iterateNodes(n.left);
            iterateNodes(n.right);
            break;
        case 'CallExpression':
            console.log(Array(depth).join('-') + n.type);
            iterateNodes(n.callee);
            iterateNodes(n.property);
            iterateNodes(n.arguments);
            break;
        case 'Identifier':
            console.log(Array(depth).join('-') + n.type + '(' + n.name + ')');
            break;
        case 'ObjectExpression':
            console.log(Array(depth).join('-') + n.type);
            iterateNodes(n.properties);
            break;
        case 'Literal':
            console.log(Array(depth).join('-') + n.type + '(' + n.value + ')');
            break;
        case 'ArrayExpression':
            console.log(Array(depth).join('-') + n.type);
            iterateNodes(n.elements);
            break;
        case 'UnaryExpression':
            console.log(Array(depth).join('-') + n.type + '(' + n.operator + ')');
            iterateNodes(n.argument);
            break;
        case 'FunctionExpression':
            console.log(Array(depth).join('-') + n.type);
            iterateNodes(n.params);
            iterateNodes(n.body);
            break;
        case 'BlockStatement':
            console.log(Array(depth).join('-') + n.type);
            iterateNodes(n.body);
            break;
        case 'MemberExpression':
            console.log(Array(depth).join('-') + n.type);
            iterateNodes(n.object);
            iterateNodes(n.property);
            break;
        case 'ReturnStatement':
            console.log(Array(depth).join('-') + n.type);
            iterateNodes(n.argument);
            break;
        case 'ForStatement':
            console.log(Array(depth).join('-') + n.type);
            iterateNodes(n.init);
            iterateNodes(n.test);
            iterateNodes(n.update);
            iterateNodes(n.body);
            break;
        case 'IfStatement':
            console.log(Array(depth).join('-') + n.type);
            iterateNodes(n.test);
            iterateNodes(n.consequent);
            break;
        case 'BinaryExpression':
            console.log(Array(depth).join('-') + n.type + '(' + n.operator + ')');
            iterateNodes(n.left);
            iterateNodes(n.right);
            break;
        case 'UpdateExpression':
            console.log(Array(depth).join('-') + n.type + '(' + n.operator + ')');
            iterateNodes(n.argument);
            break;
        case 'ThisExpression':
            console.log(Array(depth).join('-') + n.type);
            break;
        case 'ThrowStatement':
            console.log(Array(depth).join('-') + n.type);
            iterateNodes(n.argument);
            break;
        case 'ForInStatement':
            console.log(Array(depth).join('-') + n.type);
            iterateNodes(n.left);
            iterateNodes(n.right);
            iterateNodes(n.body);
            break;
        case 'NewExpression':
            console.log(Array(depth).join('-') + n.type);
            iterateNodes(n.callee);
            iterateNodes(n.arguments);
            break;
        case 'ConditionalExpression':
            console.log(Array(depth).join('-') + n.type);
            iterateNodes(n.test);
            iterateNodes(n.consequent);
            iterateNodes(n.alternate);
            break;
        case 'FunctionDeclaration':
            console.log(Array(depth).join('-') + n.type);
            iterateNodes(n.id);
            iterateNodes(n.params);
            iterateNodes(n.body);
            break;
        case 'LogicalExpression':
            console.log(Array(depth).join('-') + n.type + '(' + n.operator + ')');
            iterateNodes(n.left);
            iterateNodes(n.right);
            break;
        case 'BreakStatement':
            console.log(Array(depth).join('-') + n.type);
            break;
        default:
            console.log(Array(depth).join('-') + n.type + '#######NOT IMPLEMENTED');
        }
    }
    depth--;
}
//    var codes = escodegen.generate(result);
//      console.log(codes);
