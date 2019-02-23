import "./_index.scss";
import template from "./index.html";

class CoprocureSearch extends HTMLElement {
  connectedCallback() {
    const data = { name: "Dario" };
    this.innerHTML = template(data);
  }
}
customElements.define("coprocure-search", CoprocureSearch);
