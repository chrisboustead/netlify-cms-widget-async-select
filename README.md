# netlify-cms-widget-select-async

[Check out a demo!](https://netlify-cms-widget-select-async.netlify.com/demo)

A simple async select widget for netlify-cms which can populate entries from a valid endpoint.  Allows for sending custom headers, data/value fields and transformations.

## Install

As an npm package:

```shell
npm install --save netlify-cms-widget-async-select
```

```js
import { Control as asyncSelectControl } from 'netlify-cms-widget-async-select'

CMS.registerWidget('async-select', asyncSelectControl)
```

Via `script` tag:

```html
<script src="https://unpkg.com/netlify-cms-widget-async-select@^1.0.0"></script>

<script>
  CMS.registerWidget('async-select', window.asyncSelectControl, window.asyncSelectPreview)
</script>
```

## How to use

Add to your Netlify CMS configuration:

```yaml
    fields:
      - { 
          name: 'test_widget',
          label: 'Test Widget',
          widget: 'async-select',
          url: 'https://jsonplaceholder.typicode.com/users',
          valueField: 'id',
          displayField: 'name',
        },
```

## Configuration

Async-select widgets may have the following properties in addition to the defaults used by netlity.

---

`url` - string - **required**

The URI of the endpoint which to request data to populate the select options.

---

`valueField` - string - **required**

Field in the data response which will be mapped to the value of the netlify widget once populated.

---

`displayField` - string - **optional** 

default: `valueField`

Field in the data response which will be mapped to the display text of the netlify widget once populated.

---

`dataKey` - string - **optional** 

default: `valueField`

Field in the data response which will be used for the source of the data.  

For example, given the below data structure, you may set `dataKey: 'data'` to populate the select dropdown as expected.

Example:
```javascript
{
    meta: {
        page: 1,
        total: 10
        ...
    }
    data: [{
        id: 1,
        name: 'user 1',
        email: 'foo@bar.com'
    },{
        ...
    }]
}
``` 

---

`headers` - object - **optional** 

default: `{}`

Key-value object of HTTP headers to pass to the endpoint.

Example:
```javascript
{
  'Content-Type': 'application/json',
  ...
}
```
---

`method` - string - **optional** 

default: `GET`

HTTP request method to use when making call to endpoint.

---

`body` - **optional** 

default: `undefined`

Body to send in request to endpoint.

---

`filter` - function - **optional** 

default: `undefined`

Function which receives parameter `entry` (Immutable.js Map) which is run on each item returned from endpoint.  Similar to `Array.prototype.filter` this will reject anything which does not return truthy.

Example: 

```javascript
filter: (entry) => {
  return entry.get('id') % 2;
}
```

---

Better documentation coming soon.

## Support

For help with this widget, open an [issue](https://github.com/chrisboustead/netlify-cms-widget-async-select) or ask the Netlify CMS community in [Gitter](https://gitter.im/netlify/netlifycms).
