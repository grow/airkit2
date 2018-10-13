/**
 * Returns a function that will only be evoked after it stops being called for
 * N milliseconds.
 * @param {function} fn Callback function.
 * @param {number} delay Milliseconds to wait.
 * @return {function}
 */
export function debounce(fn, delay) {
  let timeout = null;

  const callback = function(...args) {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      fn(...args);
    }, delay);
  };

  return callback;
}
