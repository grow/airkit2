import {Registry} from '..';
import {ModalButtonComponent} from '../modal';


const app = new Registry();
const modalOptions = {enableHashHistory: true};
app.register('modal-button', ModalButtonComponent, modalOptions);
document.addEventListener('DOMContentLoaded', () => {
  app.run();
});
