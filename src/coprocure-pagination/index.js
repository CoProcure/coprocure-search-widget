import { showFoundYesNoModal } from '../search/overlays.js';

export default class CoProcurePagination extends HTMLElement {
  static get observedAttributes() {
    return ["current","total"];
  }

  attributeChangedCallback(attr, oldValue, newValue) {
  }

  connectedCallback() {
    this.paginationIncrement = 10;
    this.pagesShown = 1;
    this.total = this.getAttribute('total');
    this.current = this.getAttribute('current');
    this.render();
  }

  render() {
    let numPages = parseInt(Math.ceil(this.total / this.paginationIncrement));
    let pageSet = [];
    let startPage = 1;
    if(this.current > 5) {
      startPage = this.current - 2;
      pageSet.push(1);
      pageSet.push('...');
    }
    for(let i = startPage;i <= numPages; i++) {
      if(i === startPage + 5) {
        pageSet.push('...');
      }
      if(i < startPage + 5 || i === numPages) {
        pageSet.push(i);
      }
    }
    if(numPages > 0) {
      this.innerHTML = `
        <div class="page-links">
          <a class="back" data-page-num="${parseInt(this.current) - 1}">
            <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 11L6 5.82759L1 1" stroke="#37A8EB"/>
            </svg>
          </a>
          ${pageSet.map( (num) => {
            let classAugment = '';
            if(num == this.current) {
              classAugment = 'current';
            }
            return `<a data-page-num="${num}" class="page-link ${classAugment}">${num}</a>`;
          }).join('\n     ')}
          <a class="forward" data-page-num="${parseInt(this.current) + 1}">
            <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 11L6 5.82759L1 1" stroke="#37A8EB"/>
            </svg>
          </a>
        </div>
      `;

      document.querySelectorAll('.page-links a').forEach( (link) => {
        link.addEventListener('click', function (event) {
          event.preventDefault()
          let desiredPage = this.dataset.pageNum;
          console.log(desiredPage);

          // If they are proceeding to the next page of results, show the search
          // feedback modal.
          const SESS_KEY = "coprocure-search-feedback-show";
          if (desiredPage > 1 &&
              window.sessionStorage.getItem(SESS_KEY) === null) {
            window.sessionStorage.setItem(SESS_KEY, "yes");
            showFoundYesNoModal();
            return;
          } else {
            console.log(window.sessionStorage.getItem(SESS_KEY));
            console.log("Search feedback modal already shown this session!");
          }

          if(desiredPage > 0 && desiredPage <= numPages) {
            let navEvent = new CustomEvent('navigation', {'detail': {'page':desiredPage}});
            document.querySelector('coprocure-pagination').dispatchEvent(navEvent);
          }
        });
      })
    }
  }

  // when you click on this it should emit a custom event to the coprocure-pagination element
}

customElements.define("coprocure-pagination", CoProcurePagination);