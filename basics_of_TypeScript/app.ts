// TypeScript safely interacts with the HTML elements
const greetingElement = document.getElementById('greeting') as HTMLHeadingElement;

greetingElement.textContent = "Hello, TypeScript!";
