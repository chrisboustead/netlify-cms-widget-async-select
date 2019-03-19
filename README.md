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

You must specify the `valueField` and `url` on the field definition.  Optionally you may pass `headers` object, `method` string and `body` data for the request.

Better documentation coming soon.

## Support

For help with this widget, open an [issue](https://github.com/chrisboustead/netlify-cms-widget-select-async) or ask the Netlify CMS community in [Gitter](https://gitter.im/netlify/netlifycms).
