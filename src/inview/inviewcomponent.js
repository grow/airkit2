import Component from '../component/component';


/**
 * @typedef {Object} InviewComponentOptions
 * @property {string} inviewClass
 * @property {string} rootMargin
 * @property {number|Array<number>} threshold
 */


/**
 * Component that adds a class to an element when it comes inview.
 */
export class InviewComponent extends Component {
  /**
   * Creates an InviewComponent.
   * @param {Element} element
   * @param {InviewComponentOptions} options
   * @override
   */
  constructor(element, options) {
    super(element, options);

    const intersectOpts = {};
    if (this.options.rootMargin) {
      intersectOpts.rootMargin = this.options.rootMargin;
    }
    if (this.options.threshold) {
      intersectOpts.threshold = this.options.threshold;
    }

    /** @type {IntersectionObserver} */
    this.observer = new IntersectionObserver((entries) => {
      this.handleIntersect_(entries);
    }, intersectOpts);
  }

  /** @override */
  init() {
    super.init();
    this.observer.observe(this.element);
  }

  /** @override */
  destroy() {
    super.destroy();
    this.observer.disconnect();
    this.observer = null;
  }

  /**
   * Handles intersection observer events.
   * @param {Array.<IntersectionObserverEntry>} entries
   * @private
   */
  handleIntersect_(entries) {
    // Even if multiple thresholds are provided, only check the first threshold
    // to determine if the element is "inview".
    const entry = entries[0];
    const isInview = entry.isIntersecting;
    this.handleInview_(isInview);
  }

  /**
   * Handles whether the element is within view.
   * @param {boolean} isInview
   * @protected
   */
  handleInview_(isInview) {
    if (this.options.inviewClass) {
      this.element.classList.toggle(this.options.inviewClass, isInview);
    }
  }
}


export default InviewComponent;
