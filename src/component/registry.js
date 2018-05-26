import Component from './component'; /* eslint no-unused-vars: off */


/**
 * A constructor for a component.
 * @typedef {function(new: Component, Element, Object)} ComponentCtor
 */


/**
 * Component registry for Airkit. The registry monitors the DOM for changes and
 * automatically creates and destroys any components as elements enter and
 * leave the DOM.
 */
export class Registry {
  /**
   * Creates a new registry.
   */
  constructor() {
    /** @type {MutationObserver} */
    this.observer = new MutationObserver(() => this.updateComponents());

    /** @type {Array.<ComponentHandler>} */
    this.handlers = [];
  }

  /**
   * Registers a component in the registry.
   * @param {string} cssClassName CSS class of elements to render the
   *     components into.
   * @param {ComponentCtor} componentCtor The component constructor, which
   *     should be a subclass of `Component`.
   * @param {Object=} options Options to pass to every component
   *     constructor.
   * @return {Registry} The registry instance, for chaining.
   */
  register(cssClassName, componentCtor, options=null) {
    this.handlers.push(
        new ComponentHandler(cssClassName, componentCtor, options || {}));
    return this;
  }

  /**
   * Starts the registry's DOM listener and renders any registered components.
   * The registry then manages the lifecycle of components as elements enter and
   * leave the DOM, initializing and destroying the components as necessary.
   */
  run() {
    this.updateComponents();
    this.observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class'],
      childList: true,
      subtree: true,
    });
  }

  /**
   * Destroys the registry.
   */
  destroy() {
    this.handlers.forEach((handler) => handler.destroy());
    this.handlers = [];
    this.observer.disconnect();
  }

  /**
   * Adds and removes all registered components depending on their state in the
   * DOM.
   */
  updateComponents() {
    this.handlers.forEach((handler) => handler.updateComponents());
  }
}


/**
 * Class for a registered component handler. The handler is responsible for
 * initializing and destroying components that are registered via a given
 * CSS class name.
 */
class ComponentHandler {
  /**
   * Creates a new registration.
   * @param {string} cssClassName
   * @param {ComponentCtor} componentCtor
   * @param {Object} options
   */
  constructor(cssClassName, componentCtor, options) {
    /**
     * An active NodeList that matches the `cssClassName`.
     * @type {NodeList}
     */
    this.nodeList = document.getElementsByClassName(cssClassName);

    /** @type {ComponentCtor} */
    this.componentCtor = componentCtor;

    /**
     * Options object to pass to every component constructor.
     * @type {Object}
     */
    this.options = options;

    /**
     * A map of id => component.
     * @type {Object<Component>}
     */
    this.components = {};

    /**
     * The ID to assign to the component once it's created. This is used to keep
     * track of components in `this.components` since the element itself is not
     * hashable.
     * @type {number}
     * @private
     */
    this.nextId_ = 1;
  }

  /**
   * Adds and removes components depending on their state in the DOM.
   */
  updateComponents() {
    // Init new components.
    const activeElements = new Set();

    for (let i = 0, element; element = this.nodeList[i]; i++) {
      if (!element.airkitId) {
        element.airkitId = this.nextId_++;
        const component = new this.componentCtor(element, this.options);
        component.init();
        this.components[element.airkitId] = component;
      }
      activeElements.add(element.airkitId);
    }

    // Destroy any component no longer in the DOM.
    Object.values(this.components)
        .filter((component) => !activeElements.has(component.element.airkitId))
        .forEach((component) => {
          this.destroyComponent_(component);
        });
  }

  /**
   * Destroys all components managed by the handler.
   */
  destroy() {
    Object.values(this.components).forEach((component) => {
      this.destroyComponent_(component);
    });

    // Remove the active NodeList object to free up memory.
    this.nodeList = null;
    this.components = null;
  }

  /**
   * Destroys a component and unregisters the element from the handler.
   * @param {Component} component
   * @private
   */
  destroyComponent_(component) {
    delete this.components[component.element.airkitId];
    component.element.airkitId = null;
    component.destroy();
  }
}


export default Registry;
