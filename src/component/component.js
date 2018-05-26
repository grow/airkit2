/**
 * Base class for an Airkit component.
 */
export class Component {
  /**
   * Creates the component.
   * @param {Element} element The element to render the component into.
   * @param {Object} options Configuration options.
   */
  constructor(element, options) {
    /** @type {Element} */
    this.element = element;

    /** @type {Object} */
    this.options = options;
  }

  /**
   * Initializes the component. This is generally where event listeners should
   * be added and any child elements rendered.
   */
  init() {
    this.element.setAttribute('ak-init', 'true');
  }

  /**
   * Destroys the component, cleans up any listeners.
   */
  destroy() {
    this.element.removeAttribute('ak-init');
    this.element = null;
    this.options = null;
  }
}


export default Component;
