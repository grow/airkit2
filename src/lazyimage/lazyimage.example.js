import Registry from '../component/registry';
import LazyImageComponent from '../lazyimage/lazyimagecomponent';


const app = new Registry();
app.register('lazyimage', LazyImageComponent, {
  inviewClass: 'lazyimage--visible',
  loadedClass: 'lazyimage--loaded',
});
document.addEventListener('DOMContentLoaded', () => {
  app.run();
});
