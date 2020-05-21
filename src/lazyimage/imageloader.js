/**
 * Class for handling loading of one or more images.
 */
export class ImageLoader {
  /**
   * Creates a new image loader.
   */
  constructor() {
    /**
     * A map of image src => promise.
     * @type {Object<string, Promise<string>}
     */
    this.promises = {};
  }

  /**
   * Adds an image to the image loader.
   * @param {string} src
   * @return {Promise<string>} A promise that resolves once the image is
   *     finished loading.
   */
  load(src) {
    if (this.promises[src]) {
      return this.promises[src];
    }

    const promise = new Promise((resolve, reject) => {
      const img = new Image();
      img.addEventListener('load', () => {
        resolve(src);
      }, {once: true});
      img.addEventListener('error', () => {
        reject(new Error('failed to load image'));
      });
      // TODO(stevenle): handle failed image load.
      img.src = src;
    });
    this.promises[src] = promise;

    // If the image fails to load, remove the promise from cache since a
    // repeated call might have a successful response.
    promise.catch((reason) => {
      console.error(reason);
      delete this.promises[src];
    });
    return promise;
  }

  /**
   * Returns a promise that resolves when all images are finished loading.
   * @return {Promise}
   */
  wait() {
    return Promise.all(Object.values(this.promises));
  }
}


export default ImageLoader;
