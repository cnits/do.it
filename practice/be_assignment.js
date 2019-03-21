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
        let children = [];
        /**
         * tree = {child: parent}
         * node is a parent
         * return a list of node's children
         * tree[node] === undefined => node is a root
         */
        if(tree[node] === undefined) {
            children = Object.keys(tree);
        } else {

        }
        return children;
    }

console.log('Start ', new Date().toISOString());

const file = require('../utils/file'),
    lodash = require('lodash'),
    str = file.read('../sample/be_assignment/input.ini'),
    arr = str.split('\r\n');



const [numOfUser, ...others] = arr,
    numOfAll = parseInt(numOfUser) + 1,
    permission = Object.create(null),
    relationship = Object.create(null),
    addition = Object.create(null);
let i = 0;
others.map((text, index) => {
    if (index < numOfAll) {
        // Role on each User
        permission[index] = text.split(' ');
    } else {
        if (/^(ADD|REMOVE|QUERY)/i.test(text)) {
            // Operation
            let [opt, user, ...value] = text.split(' '),
                parent = relationship[user];
            switch (opt) {
                case 'ADD':
                    if (addition[user]) {
                        addition[user] = [...value, ...addition[user]]
                    } else {
                        addition[user] = value
                    }
                    if (parent) {
                        addition[parent] = [...addition[user]]
                    }
                    break;
                case 'REMOVE':
                    if (addition[user]) {
                        addition[user] = addition[user].filter(item => value.indexOf(item) < 0);
                    }
                    if (parent) {
                        addition[parent] = [...addition[user]]
                    }
                    break;
                case 'QUERY':
                    if (['CEO', '0'].indexOf(user.toUpperCase()) >= 0) {
                        user = '0';
                    }
                    let option = [];
                    if (addition[user]) option = addition[user];

                    permission[`${user}_${Math.random()}`] = lodash.uniq(
                        [...permission[user], ...option]
                    ).sort();
                    break;
            }

        } else {
            // Relationship
            ++i; // child
            if (['CEO', '0'].indexOf(text.toUpperCase()) >= 0) {
                text = '0';// parent
            }
            relationship[i] = text;
            permission[text] = lodash.uniq([...permission[text], ...permission[i]]).sort();
        }
    }
});

file.write('../sample/be_assignment/output.ini', lodash.toArray(permission).join('\r\n'));
console.log('End ', new Date().toISOString(), require('os').totalmem() / (1024 * 1024))