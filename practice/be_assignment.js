/**
 * This is a interview test
 * Users & Permissions
 * Take home assignment
 * The good quality of code helps engineer work comfortablely and keep the development speee high. All the engineers should be able to think about the approach in a various dimensions such as efficiency, maintainability, extensibility, simplicity and etc. Through this assignment, we would like you to submit the production-quality of code. We will ask some questions based on your submission in the following interview. That means this assignment is pretty important. Please enjoy and we hope you like this!!
 * Users & Permissions
 * Account management is one of the most fundamental features in most of the software. But a different application has a different requirement and its implementation can differ. Our application is for B to B and the client is a company. Let's think about a company as below.
 * In this company, all the users but the CEO have a single manager to report and each manager can have staff who report to them and the CEO has at least one staff to report to the CEO. Each manager gets all permissions of staff under them in order to manage their work. It's guaranteed that all the users have at least 1 permission.
 * Let's say we have CEO and User 1-6 and permissions as below. In this case, User 1 manages User 3, User 4 and User 5 to User 1 will get permission A, B, C, D. User 2 will get permission A, B, C, E. CEO will have permission A, B, C, D, E, F. We would like to know which users have which permissions.

 */

const
    childrenOf = (tree, node = 0) => {
        /**
         * tree = {child: parent}
         * node is a parent
         * return a list of node's children
         * tree[node] === undefined => node is a root
         */
        let children = [];
        if (!tree || node < 0 || node > Object.keys(tree).length - 1) {
            // Do nothing
        } else {
            if (tree[node] === undefined) {
                children = Object.keys(tree);
            } else {
                for (const branch in tree) {
                    const parent = Number(tree[branch]),
                        child = Number(branch);
                    if (node === parent) {
                        children = [...children, child, ...childrenOf(tree, child)];
                    }
                }
            }
        }
        return children;
    },
    getNodeValue = (node, dataset, extra = []) => {
        const strNameNode = String(node);
        if (!Array.isArray(extra)) {
            extra = [];
        }
        if (dataset[strNameNode]) {
            return [...dataset[strNameNode], ...extra];
        }
        return extra;
    },
    getNodeValueList = (nodeList, dataset, _operation = {}) => {
        let _data = [];
        for (const node of nodeList) {
            _data = [..._data, ...getNodeValue(node, dataset, _operation[String(node)])];
        }
        return lodash.uniq(_data).sort();
    };

console.log('Start ', new Date().toISOString());

// Get data from file
const file = require('../utils/file'),
    lodash = require('lodash'),
    memorize = require('../utils/memorize'),
    str = file.read('./sample/be_assignment/input.ini'),
    arr = str.split('\r\n');


// Declaring variables to store data information
const [numOfUser, ...others] = arr,
    numOfAll = parseInt(numOfUser) + 1,
    permission = Object.create(null), // DATA OF NODE
    relationship = Object.create(null), // TREE
    operation = Object.create(null), // Store tree changed based on perations
    trackedQuery = []; // Tracking the order of the query which defined in the file

// Analyzing the input data
let i = 0;
others.map((text, index) => {
    if (index < numOfAll) {
        // Role on each User
        permission[index] = text.split(' ');
    } else {
        if (/^(ADD|REMOVE|QUERY)/i.test(text)) {
            // Operation
            let [opt, user, ...value] = text.split(' ');
            switch (opt) {
                case 'ADD':
                    if (operation[user]) {
                        operation[user] = [...value, ...operation[user]]
                    } else {
                        operation[user] = value
                    }
                    break;
                case 'REMOVE':
                    if (operation[user]) {
                        operation[user] = operation[user].filter(item => value.indexOf(item) < 0);
                    }
                    break;
                case 'QUERY':
                    if (['CEO', '0'].indexOf(user.toUpperCase()) >= 0) {
                        user = '0';
                    }
                    const theOrderOfQuery = trackedQuery.length;
                    trackedQuery[theOrderOfQuery] = { [user]: operation[user] || [] };
                    break;
            }

        } else {
            // Relationship
            ++i; // child
            if (['CEO', '0'].indexOf(text.toUpperCase()) >= 0) {
                text = '0';// parent
            }
            relationship[i] = text;
            // permission[text] = lodash.uniq([...permission[text], ...permission[i]]).sort();
        }
    }
});

// Determine children list of each user
const childrenList = [];
[0, 1, 2, 3, 4, 5, 6].map(user => {
    childrenList[user] = [user, ...childrenOf(relationship, user)];
});

// Get permission list of each user
const output = childrenList.map(children => {
    return getNodeValueList(children, permission);
});

// Query permission of a specific user - NOT COMPLETED
trackedQuery.map(item => {
    const parseArr = Object.entries(item),
        _user = Number(parseArr[0][0]),
        _values = parseArr[0][1],
        _count = output.length,
        _children = childrenList[_user];
    // output[_count] = getNodeValueList(_children, permission, operation);
});

console.log(output);

file.write('./sample/be_assignment/output.ini', output.join('\r\n'));
console.log('End ', new Date().toISOString(), require('os').totalmem() / (1024 * 1024))

// console.log(childrenOf(relationship, 1));