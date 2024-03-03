import { Controller } from "@hotwired/stimulus"
import { Datepicker } from "vanillajs-datepicker";

// Connects to data-controller="reservation-component"
export default class extends Controller {
    static targets = ["checkin", "checkout"]

    connect() {
        let checkinPicker = new Datepicker(this.checkinTarget, {
            // ...options
        });

        let checkoutPicker = new Datepicker(this.checkoutTarget, {
            // ...options
        });
    }
}
