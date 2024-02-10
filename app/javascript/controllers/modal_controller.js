import { Controller } from "@hotwired/stimulus"
import { enter, leave, toggle} from 'el-transition'

export default class extends Controller {
    static targets = ['closeButton'];

    connect() {
       document.querySelector('#modal-wrapper').addEventListener('click', this.closeModal);
       this.closeButtonTarget.addEventListener('click', () => {
           leave(document.querySelector('#modal-wrapper'));
           leave(document.querySelector('#modal-backdrop'));
           leave(document.querySelector('#modal-panel'));
       })
    }

    showModal() {
        enter(document.querySelector('#modal-wrapper'));
        enter(document.querySelector('#modal-backdrop'));
        enter(document.querySelector('#modal-panel'));
    }

    closeModal(event) {
        const modalPanelClicked = document.getElementById('modal-panel').contains(event.target);

        if (!modalPanelClicked && event.target.id !== 'modal-trigger') {
            leave(document.querySelector('#modal-wrapper'));
            leave(document.querySelector('#modal-backdrop'));
            leave(document.querySelector('#modal-panel'));
        }
    }
}