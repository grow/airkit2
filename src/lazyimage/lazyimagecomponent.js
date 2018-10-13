import {ImageLoader} from './imageloader';
import {InviewComponent} from '../inview/inviewcomponent';
import {debounce} from '../utils/debounce';


/**
 * Component that renders one or more images when it comes inview.
 */
export class LazyImageComponent extends InviewComponent {
  /** @override */
  constructor(element, options) {
    super(element, options);

    /** @type {ImageLoader} */
    this.imageLoader = new ImageLoader();

    /** @type {boolean} */
    this.loading = false;

    /** @type {boolean} */
    this.loaded = false;

    /** @type {function} */
    this.resizeListener_ = null;
  }

  /** @override */
  init() {
    this.resizeListener_ = debounce(() => this.onResize_(), 500);
    window.addEventListener('resize', this.resizeListener_);
    super.init();
  }

  /** @override */
  destroy() {
    window.removeEventListener('resize', this.resizeListener_);
    this.imageLoader = null;
    super.destroy();
  }

  /** @override */
  handleInview_(isInview) {
    super.handleInview_(isInview);

    if (isInview && !this.loading && !this.loaded) {
      this.loadImages_();
    }
  }

  /**
   * Handles window resize events.
   */
  onResize_() {
    this.loaded = false;

    // Reload any images that are already loaded, in case the src changed.
    this.getImgElements_()
        .filter((el) => this.isImageLoaded_(el))
        .forEach((el) => this.loadImgElement_(el));
    this.getBackgroundImageElements_()
        .filter((el) => this.isImageLoaded_(el))
        .forEach((el) => this.loadBackgroundImageElement_(el));
  }

  /**
   * Loads all images with lazyimage-src or lazyimage-background-image attrs.
   * @private
   */
  loadImages_() {
    this.loading = true;

    this.getImgElements_()
        .filter((el) => this.isElementVisisble_(el) && !this.isImageLoaded_(el))
        .forEach((el) => this.loadImgElement_(el));

    this.getBackgroundImageElements_()
        .filter((el) => this.isElementVisisble_(el) && !this.isImageLoaded_(el))
        .forEach((el) => this.loadBackgroundImageElement_(el));

    this.imageLoader.wait().then(() => {
      this.loading = false;
      // TODO(stevenle): figure out a good way to deterministically tell if all
      // images have been loaded when some images may have `display: none`.
      // this.loaded = true;
      if (this.options.loadedClass) {
        this.element.classList.add(this.options.loadedClass);
      }
    });
  }

  /**
   * Returns all elements with the `lazyimage-src` attribute.
   * @return {Array.<Element>}
   */
  getImgElements_() {
    const imgEls = [].slice.call(
        this.element.querySelectorAll('[lazyimage-src]'));
    if (this.element.hasAttribute('lazyimage-src')) {
      imgEls.push(this.element);
    }
    return imgEls;
  }

  /**
   * Loads the image for a `lazyimage-src` element.
   * @param {*} el
   */
  loadImgElement_(el) {
    const src = el.getAttribute('lazyimage-src');
    const imageUrl = this.formatSrc_(el, src);
    if (el.src === imageUrl) {
      this.setImageLoaded_(el, true);
      return;
    }
    this.imageLoader.load(imageUrl).then(() => {
      el.src = imageUrl;
      this.setImageLoaded_(el, true);
    });
  }

  /**
   * Returns all elements with the `lazyimage-background-image` attribute.
   * @return {Array.<Element>}
   */
  getBackgroundImageElements_() {
    const bgEls = [].slice.call(
        this.element.querySelectorAll('[lazyimage-background-image]'));
    if (this.element.hasAttribute('lazyimage-background-image')) {
      bgEls.push(this.element);
    }
    return bgEls;
  }

  /**
   * Loads the image for an `lazyimage-background-image` element.
   * @param {Element} el
   */
  loadBackgroundImageElement_(el) {
    const src = el.getAttribute('lazyimage-background-image');
    const imageUrl = this.formatSrc_(el, src);
    const backgroundImage = `url(${imageUrl})`;
    if (el.style.backgroundImage === backgroundImage) {
      this.setImageLoaded_(el, true);
      return;
    }
    this.imageLoader.load(imageUrl).then(() => {
      el.style.backgroundImage = `url(${imageUrl})`;
      this.setImageLoaded_(el, true);
    });
  }

  /**
   * Formats the src URL, replacing any `{placeholder}`s.
   * @param {Element} el The lazyimage element.
   * @param {string} src The lazyimage URL to format.
   * @return {string} The formatted image URL.
   */
  formatSrc_(el, src) {
    return src.replace(/\{[a-z]*\}/g, (placeholder) => {
      if (placeholder == '{width}') {
        return Math.ceil(el.offsetWidth * window.devicePixelRatio);
      }
      if (placeholder == '{height}') {
        return Math.ceil(el.offsetHeight * window.devicePixelRatio);
      }
      return placeholder;
    });
  }

  /**
   * Returns `true` if the image is loaded.
   * @param {Element} el
   * @return {boolean}
   * @private
   */
  isImageLoaded_(el) {
    return !!el.akLazyImageLoaded;
  }

  /**
   * Sets whether the image has been loaded for an element.
   * @param {Element} el
   * @param {boolean} loaded
   */
  setImageLoaded_(el, loaded) {
    el.akLazyImageLoaded = loaded;
    if (loaded) {
      el.setAttribute('lazyimage-loaded', 'true');
    }
  }

  /**
   * Returns `true` if the element isn't `display: none`.
   * @param {Element} el
   * @return {boolean}
   * @private
   */
  isElementVisisble_(el) {
    return el.offsetParent !== null;
  }
}


export default LazyImageComponent;
