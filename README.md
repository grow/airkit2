# Airkit

Welcome to Airkit! Airkit is a collection of JavaScript and SASS components
designed to make life easier for the modern frontend developer.

Airkit's components are written in vanilla JavaScript (no third-party deps),
aiming to be lightweight and performant. Components will decoroate elements as
they enter the DOM, and similarly dispose themselves when they are removed.


# Development

Quick start:

```
# Install deps
yarn

# Start the dev server at localhost:3000
yarn dev
```


# Quick start

```
import * as airkit2 from 'airkit2';
import LazyImageComponent from 'airkit2/lazyimage/lazyimagecomponent';


// Create a new registry. The registry decorates and destroys components as
// elements enter and exit the DOM.
const app = new airkit2.Registry();

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
