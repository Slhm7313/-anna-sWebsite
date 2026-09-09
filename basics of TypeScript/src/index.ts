// types

// basic
let age:number = 23; // is the same as let age = 23 but is safer (other types string boolean ect)
console.log(age);

//any you can have any value and change it whenever
let every:any = 23;
console.log(every);
every = '23';

// Arrays
let numbers:number[] = [1,2,3,4];
console.log(numbers);

//tuples
let user:[number, string]=[1,'Mosh'];
console.log(user);

//Enums Pascal Case
enum Size{Small ,Medium  ,Large}
// by default Small = 0 Medium = 1 ect if you want to change that must do Small='something' or = 1 ect
let mySize: Size = Size.Small;
let yourSize: Size = Size.Medium;
let themSize: Size = Size.Large;
console.log(themSize);
console.log(yourSize);
console.log(mySize);

// functions
function calculateTax (income:number):number{ 
    return income;
} // for optional values example (name?)
console.log(calculateTax(2));

//Object 
let employee:{id:number, name: string} = {
    id:1,
    name: 'John'
} //if you don't want to change a value later do let employee:{ readonly id:number...}
console.log(employee);

// Advance Types 

//type
type Employee = {
    id:number,
    name: string
    retirement: (date:Date) => void;
};
let employee2:Employee = {
    id:1,
    name: 'Mosh',
    retirement: (date:Date) => {
        console.log(date);
    }
}
console.log(employee2);

// union Types
function kgToLbs (weight:number|string):number{
    if (typeof weight === 'number') {
        return weight *2.2;
    }else{
        return parseInt(weight) * 2.2;
    }
}
console.log(kgToLbs('23'));
console.log(kgToLbs(23));

//Intersection Types

type Draggable ={
    drag: () => void
};
type Resizable = {
    resize: () => void
};

type uIWidget = Draggable & Resizable;
let textBox: uIWidget ={
    drag: () =>{},
    resize: () =>{}
}
console.log(textBox);

// Literal (exact, specific)
// let quantity: 50 | 100 =50;
type Quantity = 50 | 100
let quantity :Quantity = 50;
console.log(quantity);

// Nullable Types
function greet(name:string | null | undefined){
    if (name){
        console.log(name.toUpperCase());
    }else{
        console.log('Hola!');
    }
}
greet(undefined)

//Optional chaining 
type Customer = {
    birthday : Date
}

function getCustomer(id:number):Customer| null | undefined{
    return id === 0 ? null: {
        birthday: new Date()
    };
}
let customer = getCustomer(0);
// optional property access operator
console.log(customer?.birthday);