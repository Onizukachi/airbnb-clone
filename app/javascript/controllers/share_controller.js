import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="share"
export default class extends Controller {
  share(e) {
    document.querySelector('#share-modal-trigger').click();
  }
}
