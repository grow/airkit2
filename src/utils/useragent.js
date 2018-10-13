export function isMobile() {
  return isIOS() || isAndroid();
}


export function isIOS() {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}


export function isAndroid() {
  return /Android/i.test(navigator.userAgent);
}


export function isChrome() {
  return navigator.userAgent.indexOf('Chrome') != -1;
}


export function isSafari() {
  return !isChrome() && navigator.userAgent.indexOf('Safari') != -1;
}


export function isFirefox() {
  return navigator.userAgent.indexOf('Firefox') != -1;
}


export function isIE() {
  return /MSIE\/\d+/.test(navigator.userAgent);
}


export function isIEorEdge() {
  return /Edge\/\d+/.test(navigator.userAgent) ||
      /MSIE\/\d+/.test(navigator.userAgent) ||
      /Trident\/\d+/.test(navigator.userAgent);
}
