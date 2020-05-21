import {Registry} from '..';
import {LazyImageComponent} from '../lazyimage';


const app = new Registry();
app.register('lazyimage', LazyImageComponent, {
  inviewClass: 'lazyimage--visible',
  loadedClass: 'lazyimage--loaded',
});
document.addEventListener('DOMContentLoaded', () => {
  app.run();
});
