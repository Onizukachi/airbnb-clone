import { Controller } from "@hotwired/stimulus"
import { enter, leave, toggle} from 'el-transition'

export default class extends Controller {
    static targets = ['closeButton'];
    static values = { triggerId: String }

    connect() {
        this.element.addEventListener('click', (event) => this.closeModal(event));
        this.closeButtonTarget.addEventListener('click', () => {
           leave(this.element);
           leave(this.element.querySelector('#modal-backdrop'));
           leave(this.element.querySelector('#modal-panel'));
       })
    }

    showModal() {
        enter(this.element);
        enter(this.element.querySelector('#modal-backdrop'));
        enter(this.element.querySelector('#modal-panel'));
    }

    closeModal(event) {
        const modalPanelClicked = this.element.querySelector('#modal-panel').contains(event.target);
        if (!modalPanelClicked && event.target.id !== this.triggerIdValue) {
            leave(this.element);
            leave(this.element.querySelector('#modal-backdrop'));
            leave(this.element.querySelector('#modal-panel'));
        }
    }
}