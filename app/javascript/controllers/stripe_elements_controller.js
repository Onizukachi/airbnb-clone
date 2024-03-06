import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="share"
export default class extends Controller {
    submitButtonClass = 'mt-4 w-full rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 cursor-pointer'
    connect() {
        this.getStripeFormLabel().classList.add('hidden');
        this.getStripeSubmitButton().className += this.submitButtonClass;
    }

    getStripeCardElement() {
        return document.getElementById('card-element');
    }

    getStripeSubmitButton() {
        return document.querySelector("#stripe-form input[type='submit']");
    }

    getStripeFormLabel() {
        return document.querySelector("label[for='card_element']");
    }
}
