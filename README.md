# Airkit2

Airkit2 is a collection of JavaScript and SASS components designed to make life
easier for the modern frontend developer.

Airkit2's components are written in vanilla JavaScript (no third-party deps),
aiming to be lightweight and performant. Components will decoroate elements as
they enter the DOM, and similarly dispose themselves when they are removed.


## Installation

```bash
npm install airkit2
```


## Getting started

```javascript
import {Registry} from 'airkit2';
import {LazyImageComponent} from 'airkit2/lazyimage';


// Create a new component registry, which handles decoration of elements as
// they enter and leave the DOM.
const app = new Registry();

// Set options for a component. Each component can have its own set of
// configurable options.
const lazyimageOptions = {
  inviewClass: 'lazyimage--visible',
  loadedClass: 'lazyimage--loaded',
};

// Register the component and bind it to a specific CSS class. When an element
// enters the DOM with that class, the component will be initialized on that
// element.
app.register('lazyimage', LazyImageComponent, lazyimageOptions);

// Start the airkit2 app.
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
