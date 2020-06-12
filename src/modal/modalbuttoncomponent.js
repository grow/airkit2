import {Component} from '../component';


/**
 * Component that opens a modal dialog.
 */
export class ModalButtonComponent extends Component {
  /** @override */
  constructor(element, options) {
    super(element, options);

    /** @type {boolean} */
    this.active_ = false;

    /** @type {?function(Event)} */
    this.clickHandler_ = null;

    /** @type {?function(Event)} */
    this.keyboardHandler_ = null;

    /**
     * The scroll y position is stored in case the user scrolls while the modal
     * is opened. Once closed, the page resets to the original y position.
     * @type {number}
     */
    this.scrollY_ = 0;

    /**
     * Attr name used on the button to determine which modal to open.
     * @type {string}
     */
    this.modalOpenAttr_ = options.modalOpenAttr || 'data-modal-open';

    /**
     * Attr name used to identify which element to grab the modal contents
     * from. The first child element of that parent element that matches the
     * modal id will be placed into the modal of the modal when opened.
     * @type {string}
     */
    this.modalIdAttr_ = options.modalIdAttr || 'data-modal-id';

    /**
     * If enabled, opening a modal dialog will push a hash url to html5 history.
     * When opening a new page with a #hash in the url, the modal will
     * automatically open.
     */
    this.enableHashHistory_ = options.enableHashHistory || false;

    this.modalDialog_ = null;
  }

  /** @override */
  init() {
    super.init();
    this.clickHandler_ = (e) => {
      e.preventDefault();
      this.open();
    };
    this.element.addEventListener('click', this.clickHandler_);

    if (this.enableHashHistory_) {
      window.addEventListener('popstate', (e) => this.onHistoryChange_(e));

      const hash = window.location.hash.substr(1);
      if (hash && this.getModalId() === hash) {
        this.open();
      }
    }
  }

  onHistoryChange_(e) {
    const state = e.state && e.state['modalId'];
    const hash = window.location.hash.substr(1);
    const modalId = this.getModalId();
    if (state === modalId && hash === modalId) {
      this.open();
    } else {
      this.close();
    }
  }

  /** Opens the modal dialog. */
  open() {
    if (this.active_) {
      return;
    }

    const modalBodyEl = this.getModalBody();
    this.modalDialog_ = new ModalDialog(modalBodyEl);
    this.modalDialog_.on('close', () => {
      this.close();
    });
    this.modalDialog_.render();
    this.modalDialog_.open();

    // Save the scroll y position in case the user scrolls while the modal is
    // open.
    this.scrollY_ = window.pageYOffset;

    // Listen for ESC key.
    this.keyboardHandler_ = (e) => this.onKeyDown_(e);
    document.body.addEventListener('keydown', this.keyboardHandler_);

    if (this.enableHashHistory_) {
      const modalId = this.getModalId();
      const hash = window.location.hash.substr(1);
      if (hash !== modalId) {
        window.history.pushState({
          'modalId': modalId,
        }, '' /* title */, `#${modalId}`);
      }
    }

    this.active_ = true;
  }

  /** Closes the modal dialog. */
  close() {
    if (!this.active_) {
      return;
    }

    if (this.keyboardHandler_) {
      document.body.removeEventListener('keydown', this.keyboardHandler_);
      this.keyboardHandler_ = null;
    }

    // Restore the original Y position before the modal was opened.
    window.scrollTo(0, this.scrollY_);

    // Move the modal body element back to its original container.
    const modalEl = this.getModalWrapper();
    modalEl.appendChild(this.modalDialog_.getModalBody());

    // Destroy the modal element.
    this.modalDialog_.destroy();
    this.modalDialog_ = null;

    if (this.enableHashHistory_) {
      window.history.pushState({
        'modalId': null,
      }, '' /* title */, window.location.pathname);
    }

    this.active_ = false;
  }

  getModalId() {
    const modalId = this.element.getAttribute(this.modalOpenAttr_);
    if (!modalId) {
      throw new Error(`missing attr: ${this.modalOpenAttr_}`);
    }
    return modalId;
  }

  getModalWrapper() {
    const modalId = this.getModalId();
    const modalSelector = `[${this.modalIdAttr_}="${modalId}"]`;
    const modalEl = document.querySelector(modalSelector);
    if (!modalEl) {
      throw new Error(`missing el with ${this.modalIdAttr_}="${modalId}"`);
    }
    return modalEl;
  }

  getModalBody() {
    const modalBodyEl = this.getModalWrapper().firstElementChild;
    return modalBodyEl;
  }

  /**
   * Handles key press events. Attached when the modal is opened.
   * @param {KeyboardEvent} e
   * @private
   */
  onKeyDown_(e) {
    if (e.keyCode == 27 /* ESC */) {
      this.close();
    }
  }

  /** @override */
  destroy() {
    if (this.clickHandler_) {
      this.element.removeEventListener('click', this.clickHandler_);
      this.clickHandler_ = null;
    }
    if (this.keyboardHandler_) {
      document.body.removeEventListener('keydown', this.keyboardHandler_);
      this.keyboardHandler_ = null;
    }
    super.destroy();
  }
}


/**
 * Modal dialog box.
 */
export class ModalDialog {
  constructor(modalBodyEl) {
    this.element = null;
    this.modalBodyEl_ = modalBodyEl;
    this.clickHandler_ = null;
    this.callbacks_ = {};
    this.active_ = false;
  }

  getModalBody() {
    return this.modalBodyEl_;
  }

  /**
   * Renders the dialog into the DOM in an unopened state.
   */
  render() {
    const el = this.createDom_('dialog', 'modal');
    const closeEl = this.createDom_('button', 'modal__x');
    el.appendChild(closeEl);
    const contentEl = this.createDom_('div', 'modal__content');
    contentEl.appendChild(this.modalBodyEl_);
    el.appendChild(contentEl);
    el.appendChild(this.createDom_('div', 'modal__mask'));
    document.body.appendChild(el);

    this.clickHandler_ = () => this.close();
    closeEl.addEventListener('click', this.clickHandler_);
    this.element = el;
  }

  /**
   * @param {string} tag
   * @param {string} className
   * @return {Element}
   * @private
   */
  createDom_(tag, className) {
    const el = document.createElement(tag);
    el.className = className;
    return el;
  }

  open() {
    if (this.active_) {
      return;
    }
    this.active_ = true;

    // Use a delay separately on `--enabled` and `--visible` states so that
    // transitions are handled properly when changing between `display: none`
    // and `display: block`.
    this.element.classList.add('modal--enabled');
    setTimeout(() => {
      this.element.classList.add('modal--visible');
    }, 300);
  }

  close() {
    if (!this.active_) {
      return Promise.resolve();
    }
    this.active_ = false;

    return new Promise((resolve) => {
      setTimeout(() => {
        this.element.classList.remove('modal--visible');
      }, 0);
      setTimeout(() => {
        this.element.classList.remove('modal--enabled');
        this.triggerCallbacks_('close');
        resolve();
      }, 300);
    });
  }

  on(eventId, callback) {
    const callbackList = this.callbacks_[eventId];
    if (callbackList) {
      callbackList.push(callback);
    } else {
      this.callbacks_[eventId] = [callback];
    }
  }

  triggerCallbacks_(eventId) {
    const callbackList = this.callbacks_[eventId];
    if (!callbackList) {
      return;
    }
    callbackList.forEach((cb) => {
      try {
        cb();
      } catch (e) {
        console.error(e);
      }
    });
  }

  destroy() {
    this.close().then(() => this.element.remove());
  }
}


export default ModalButtonComponent;
