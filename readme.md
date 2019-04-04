# The CoProcure government procurement contract search widget

You can install this component on your site if you would like to add the CoProcure contract search engine to your webpage.

## How to install

1) Include the javascript

    Either:
    
    - Install the package locally:

      ```
      npm i @coprocure/search-widget
      ```
      and

    - Require it in your bundle:

      ```
      import '@coprocure/search-widget'
      ```

    Or

    - Include the script tag in your page:

      ```
      <script src="https://components.coprocure.us/dist/search/v2/index.js" type="text/javascript"></script>
      ```

2) Add the web component custom element to your HTML:

```
<coprocure-search data-results="10" data-display-state="0" />
```
      