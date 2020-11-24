import {Component} from '../component';
import {isMobile} from '../utils/useragent';


/**
 * Component that opens a fullscreen modal with YouTube player when an element
 * is clicked.
 */
export class YTModalComponent extends Component {
  /** @override */
  constructor(element, options) {
    super(element, options);

    /** @private {YTModalPlayer} */
    this.modalPlayer_ = options.modalPlayer || YTModalPlayer.getInstance();

    /** @private {string} */
    this.videoId_ = this.element.dataset.youtubeId;

    /** @private {string} */
    this.listId_ = this.element.dataset.youtubeListId;

    /** @type {?function(Event)} */
    this.clickHandler_ = null;

    /** @type {?function(Event)} */
    this.keyboardHandler_ = null;

    this.modalPlayer_.init(options);
  }

  /** @override */
  init() {
    super.init();
    this.clickHandler_ = (e) => {
      e.preventDefault();
      this.modalPlayer_.play(this.videoId_, this.listId_);
    };
    this.element.addEventListener('click', this.clickHandler_);

    this.initAriaControls_();
  }

  /**
   * Adds aria attrs and keyboard controls.
   * @private
   */
  initAriaControls_() {
    // Add `tabindex="0"` and `role="button"` if they don't exist.
    if (!this.element.getAttribute('tabindex')) {
      this.element.setAttribute('tabindex', '0');
    }
    if (!this.element.getAttribute('role')) {
      this.element.setAttribute('role', 'button');
    }

    // Add keyboard listener to trigger the modal when "enter" is hit.
    this.keyboardHandler_ = (e) => {
      if (e.key == 'Enter') {
        e.preventDefault();
        this.modalPlayer_.play(this.videoId_, this.listId_);
      }
    };
    this.element.addEventListener('keydown', this.keyboardHandler_);
  }

  /** @override */
  destroy() {
    if (this.clickHandler_) {
      this.element.removeEventListener('click', this.clickHandler_);
      this.clickHandler_ = null;
    }
    if (this.keyboardHandler_) {
      this.element.removeEventListener('keydown', this.keyboardHandler_);
      this.keyboardHandler_ = null;
    }
    super.destroy();
  }
}


let singletonModal_ = null;


/**
 * Modal that plays a YouTube video.
 */
export class YTModalPlayer {
  constructor() {
    /** @type {Element} */
    this.element = null;

    /** @type {boolean} */
    this.active = false;

    /** @private {?function(KeyboardEvent)} */
    this.keyboardListener_ = null;

    /** @private {YT.Player} */
    this.ytPlayer_ = null;

    /** @type {boolean} */
    this.useAppOnMobile_ = true;

    /** @type {boolean} */
    this.openNewWindowMobile_ = false;
  }

  /** @public */
  init(options) {

    if (options.useAppOnMobile != undefined) {
      this.useAppOnMobile_ = options.useAppOnMobile;
    }

    if (options.openNewWindowMobile != undefined) {
      this.openNewWindowMobile_ = options.openNewWindowMobile;
    }

    this.initDom_();
    this.initYouTubeApi_();
  }

  /** @private */
  initDom_() {
    const el = this.createDom_('div', 'ytmodal-player');
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    const closeEl = this.createDom_('div', 'ytmodal-player__x');
    el.appendChild(closeEl);
    el.appendChild(this.createDom_('div', 'ytmodal-player__player'));
    el.appendChild(this.createDom_('div', 'ytmodal-player__mask'));
    document.body.appendChild(el);
    closeEl.addEventListener('click', () => {
      this.close();
    });
    this.element = el;
  }

  /** @private */
  initYouTubeApi_() {
    const tag = document.createElement('script');
    tag.setAttribute('src', 'https://www.youtube.com/iframe_api');
    document.body.appendChild(tag);
  }

  /**
   * @param {boolean} active
   * @private
   */
  setActive_(active) {
    if (active) {
      this.keyboardListener_ = (e) => this.onKeyDown_(e);
      document.body.addEventListener('keydown', this.keyboardListener_);
      document.body.classList.add('ak2-modal-open');
    } else {
      this.ytPlayer_.pauseVideo();
      if (this.keyboardListener_) {
        document.body.removeEventListener('keydown', this.keyboardListener_);
      }
      document.body.classList.remove('ak2-modal-open');
    }

    // Use a delay separately on `--enabled` and `--visible` states so that
    // transitions are handled properly when changing between `display: none`
    // and `display: block`.
    setTimeout(() => {
      this.element.classList.toggle('ytmodal-player--enabled', active);
    }, active ? 0 : 300);
    setTimeout(() => {
      this.element.classList.toggle('ytmodal-player--visible', active);
    }, active ? 300 : 0);

    this.active = active;
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

  /**
   * @param {KeyboardEvent} e
   * @private
   */
  onKeyDown_(e) {
    if (e.keyCode == 27 /* ESC */) {
      this.setActive_(false);
    }
  }

  /**
   * @param {string} videoId
   * @param {?string} opt_listId
   */
  play(videoId, opt_listId) {
    // On mobile, play directly in YouTube.
    if (this.useAppOnMobile_ && isMobile()) {
      const mobileUrl = `https://m.youtube.com/watch?v=${videoId}`;
      if(this.openNewWindowMobile_) {
        var win = window.open(mobileUrl, '_blank');
        win.focus();
      } else {
        window.location.href = mobileUrl;
      }
      return;
    }

    if (this.ytPlayer_) {
      this.ytPlayer_.loadVideoById(videoId, 0, 'large');
    } else {
      const options = {
        'videoId': videoId,
        'playerVars': {
          'autohide': 1,
          'autoplay': 1,
          'fs': 1,
          'modestbranding': 1,
          'rel': 0,
          'showinfo': 0,
          'iv_load_policy': 3,
        },
      };
      if (opt_listId) {
        options['playerVars']['listType'] = 'playlist';
        options['playerVars']['list'] = opt_listId;
      }
      const playerEl =
          this.element.getElementsByClassName('ytmodal-player__player')[0];
      this.ytPlayer_ = new YT.Player(playerEl, options);
    }

    this.setActive_(true);
  }

  /** Closes the modal player. */
  close() {
    this.setActive_(false);
  }

  /** @return {YTModalPlayer} A singleton instance of the modal player. */
  static getInstance() {
    if (!singletonModal_) {
      singletonModal_ = new this();
    }
    return singletonModal_;
  }
}


export default YTModalComponent;
