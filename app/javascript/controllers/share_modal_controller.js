import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="share"
export default class extends Controller {
    copy() {
        navigator.clipboard.writeText(this.element.dataset.shareUrl);
    }

    shareWhatsapp() {
        window.open("https://web.whatsapp.com", '_blank', 'noopener, noreferrer');
    }

    shareTwitter() {
        window.open("https://twitter.com", '_blank', 'noopener, noreferrer');
    }

    shareFacebook() {
        window.open("https://www.facebook.com/", '_blank', 'noopener, noreferrer');
    }
}
