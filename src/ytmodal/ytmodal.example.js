import {Registry} from '..';
import {YTModalComponent} from '../ytmodal';


const app = new Registry();
const ytmodalOptions = {};
app.register('ytmodal', YTModalComponent, ytmodalOptions);
document.addEventListener('DOMContentLoaded', () => {
  app.run();
});
