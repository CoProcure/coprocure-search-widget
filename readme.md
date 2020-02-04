# The CoProcure government procurement contract search widget

This package is shared by embedded widgets, e.g. http://marc2.org/assets/kcrpc/index.htm, and by our website www.coprocure.us.

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
- Include non-cooperative contracts in the search: ```show-non-coop="true"```
- Include expired contracts in the search: ```show-expired="true"```

# Development
- Make your changes
- `npm test` in the search widget repo
- Go to the components.coprocure.us repo and run the script `./rebuild_widget.sh` there. This runs `npm run build`  in the widget repo, copies the files locally into the  components.coprocure repo and then rebuilds components.coprocure.us.
- Paste the following code into a file in the parent of your code repos called localserver-components.js:
```
    const express = require('express')
    const app = express()
    app.use(express.static('components.coprocure.us/'))
    let port = process.argv[2]? process.argv[2] : 1337;
    app.listen(port, () => console.log(`Example app listening on port ${port}!`));
```
  Then run `node localserver-components.js` from that directory.
- Navigate to the local version of the site you’re trying to test
    - http://localhost:1337/partners/columbia-test2.html for NIGP
    - http://localhost:1337/partners/marc-test2.html for KCRPC.
    - Note that for KCRPC, you’ll have to fire up another instance on port 1339 by running `node localserver-components.js 1339` (this was done to make sure that it works cross domain).
- Update coprocure.us by running `./rebuild-widget.sh` from the coprocure.us directory and test according to https://github.com/CoProcure/coprocure.us

# Deployment
## Test browsers
- Test your functionality. Generally, test every browser that has a different rendering engine
  - Chrome
  - Safari
  - Firefox
  - Edge
  - IE11
  If testing in Browserstack, make sure you have the localhost extension installed.

## Update the NPM package
- When everything is ready, `npm version patch` to up the version (or do this manually)
- Push your changes to git
- `npm publish --access public`

## Update components.coprocure.us
- Go to the components.coprocure.us repo
- `npm install @coprocure/search-widget`
- `npm run build`
- Retest the functionality locally on at least one browser (restart your localservers).
- Check in those changes to the components repo.
- `npm run deploy` to publish these new changes to S3
- That doesn’t actually touch the files that our partners are referring to. To update Portland
    - `cp dist/search/v2/index.js dist/index2.js`
    - `cp dist/search/v2/index.js.map dist/index2.js.map`
    - `npm run deploy` again
    - <a href="https://www.dropbox.com/scl/fi/m3fz75knz4nda47g2cdhr/Software-Engineer-Documentation.paper?dl=0">Clear the cloudfront cache.</a>
    - Test the Portland embedded widget. (shift+Cmd+R to bypass your browser cache)
- To update KCRPC
    - `cp dist/search/v2/index.js dist/index.js`
    - `cp dist/search/v2/index.js.map dist/index.js.map`
    - `npm run deploy` again
    - Test the KCRPC embedded widget (you may again need to clear Cloudfront and local cache).
- Update the coprocure.us website according to https://github.com/CoProcure/coprocure.us
