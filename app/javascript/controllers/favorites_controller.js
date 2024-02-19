import { Controller } from "@hotwired/stimulus"

export default class extends Controller {

    favorite() {
        if (this.element.dataset.favorited === 'true') {
            this.element.setAttribute("fill", "#ced4da");
            this.element.dataset.favorited = 'false';
        } else {
            this.element.setAttribute("fill", "red");
            this.element.dataset.favorited = 'true';
        }
    }
}