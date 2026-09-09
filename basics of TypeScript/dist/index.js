"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let age = 23;
console.log(age);
let every = 23;
console.log(every);
every = '23';
let numbers = [1, 2, 3, 4];
console.log(numbers);
let user = [1, 'Mosh'];
console.log(user);
var Size;
(function (Size) {
    Size[Size["Small"] = 0] = "Small";
    Size[Size["Medium"] = 1] = "Medium";
    Size[Size["Large"] = 2] = "Large";
})(Size || (Size = {}));
let mySize = Size.Small;
let yourSize = Size.Medium;
let themSize = Size.Large;
console.log(themSize);
console.log(yourSize);
console.log(mySize);
function calculateTax(income) {
    return income;
}
console.log(calculateTax(2));
let employee = {
    id: 1,
    name: 'John'
};
console.log(employee);
let employee2 = {
    id: 1,
    name: 'Mosh',
    retirement: (date) => {
        console.log(date);
    }
};
console.log(employee2);
function kgToLbs(weight) {
    if (typeof weight === 'number') {
        return weight * 2.2;
    }
    else {
        return parseInt(weight) * 2.2;
    }
}
console.log(kgToLbs('23'));
console.log(kgToLbs(23));
let textBox = {
    drag: () => { },
    resize: () => { }
};
console.log(textBox);
let quantity = 50;
console.log(quantity);
function greet(name) {
    if (name) {
        console.log(name.toUpperCase());
    }
    else {
        console.log('Hola!');
    }
}
greet(undefined);
function getCustomer(id) {
    return id === 0 ? null : {
        birthday: new Date()
    };
}
let customer = getCustomer(0);
console.log(customer?.birthday);
//# sourceMappingURL=index.js.map