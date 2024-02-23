import { Controller } from "@hotwired/stimulus"
import { toggle } from 'el-transition'

export default class extends Controller {
  static targets = ['openUserMenu', 'userAuthLink']

  connect() {
    this.openUserMenuTarget.addEventListener('click', this.toggleDropdownMenu);
    this.userAuthLinkTargets.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector('#user-auth-modal-trigger').click();
      })
    })
  }

  toggleDropdownMenu() {
    toggle(document.querySelector('#menu-dropdown-items'));
  }
}
