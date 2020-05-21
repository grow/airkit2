# Airkit2

Welcome to Airkit2! Airkit2 is a collection of JavaScript and SASS components
designed to make life easier for the modern frontend developer.

Airkit2's components are written in vanilla JavaScript (no third-party deps),
aiming to be lightweight and performant. Components will decoroate elements as
they enter the DOM, and similarly dispose themselves when they are removed.


## Quick start

Installation

```bash
npm install airkit2
```

JavaScript

```javascript
import {Registry} from 'airkit2';
import {LazyImageComponent} from 'airkit2/lazyimage';


// Create a new registry. The registry decorates and destroys components as
// elements enter and exit the DOM.
const app = new Registry();

// Register components to the registry. When an element enters the DOM with
// the registered className, the component will decorate the element.
app.register('lazyimage', LazyImageComponent, {
  inviewClass: 'lazyimage--visible',
  loadedClass: 'lazyimage--loaded',
});

// Start the registry.
document.addEventListener('DOMContentLoaded', () => {
  app.run();
});
```


## Development

```
# Install deps
npm install

# Start the dev server at localhost:3000
npm run dev
```
