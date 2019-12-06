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

## Parameters

- Control the number of results returned on each page: ```data-results="10"```
- Limit the initial data set to a set of buyers: ```buyers='["State of Michigan"]'```
- Load a set of results before any query is entered: ```prepop="true"```
- Limit the scope of any query to results from a specific set of buyers: ```searchonly="State of Michigan"```