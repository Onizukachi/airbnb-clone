import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="property"
export default class extends Controller {
    readDescription() {
        document.querySelector('#property-description-modal-trigger').click();
    }
}
