import './bootstrap.js';
import CMS, { init } from 'netlify-cms';
import 'netlify-cms/dist/cms.css';
import { Control, Preview } from '../src';

const config = {
  backend: {
    name: 'test-repo',
    login: false,
  },
  media_folder: 'assets',
  collections: [
    {
      name: 'test',
      label: 'Test',
      files: [
        {
          file: 'test.yml',
          name: 'test',
          label: 'Test',
          fields: [
            {
              name: 'test_widget',
              label: 'Test Widget',
              widget: 'async-select',
              url: 'https://jsonplaceholder.typicode.com/users',
              valueField: 'id',
              displayField: 'name',
            },
            {
              name: 'test_widget_2',
              label: 'Test Widget 2',
              widget: 'async-select',
              multiple: true,
              url: 'https://jsonplaceholder.typicode.com/users',
              valueField: 'id',
              displayField: 'name',
              searchField: 'name',
            },
            {
              name: 'test_widget_3',
              label: 'Test Widget 3',
              widget: 'async-select',
              multiple: true,
              url: 'https://jsonplaceholder.typicode.com/users',
              valueField: 'id',
              displayField: 'name',
              searchField: 'name',
              filter: function(entry) {
                return entry.get('id') % 2;
              },
            },
          ],
        },
      ],
    },
    {
      name: 'posts',
      label: 'Posts',
      create: true,
      slug: '{{year}}-{{month}}-{{day}}-{{slug}}',
      folder: '_posts',

      fields: [
        { label: 'Title', name: 'title', widget: 'string', tagname: 'h1' },
        {
          label: 'Publish Date',
          name: 'date',
          widget: 'datetime',
          dateFormat: 'YYYY-MM-DD',
          timeFormat: 'HH:mm',
          format: 'YYYY-MM-DD HH:mm',
        },
        {
          label: 'Cover Image',
          name: 'image',
          widget: 'image',
          required: false,
          tagname: '',
        },
        {
          label: 'Body',
          name: 'body',
          widget: 'markdown',
          hint: 'Main content goes here.',
        },
      ],
      meta: [{ label: 'SEO Description', name: 'description', widget: 'text' }],
    },
  ],
};

CMS.registerWidget('async-select', Control, Preview);

init({ config });
