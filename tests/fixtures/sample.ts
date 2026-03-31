interface Greeting {
  name: string;
  message: string;
}

function greet(greeting: Greeting): string {
  return `${greeting.message}, ${greeting.name}!`;
}

const result = greet({ name: 'World', message: 'Hello' });
console.log(result);
