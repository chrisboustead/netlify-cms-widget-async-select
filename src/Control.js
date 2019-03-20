import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import AsyncSelect from 'react-select/lib/Async';
import { find, isEmpty, last, debounce } from 'lodash';
import { List, Map, fromJS } from 'immutable';
import { reactSelectStyles } from 'netlify-cms-ui-default';
import fuzzy from 'fuzzy';

function optionToString(option) {
  return option && option.value ? option.value : '';
}

function convertToOption(raw) {
  if (typeof raw === 'string') {
    return { label: raw, value: raw };
  }
  return Map.isMap(raw) ? raw.toJS() : raw;
}

function getSelectedValue({ value, options, isMultiple }) {
  if (isMultiple) {
    const selectedOptions = List.isList(value) ? value.toJS() : value;

    if (!selectedOptions || !Array.isArray(selectedOptions)) {
      return null;
    }

    return selectedOptions
      .map(i => options.find(o => o.value === (i.value || i)))
      .filter(Boolean)
      .map(convertToOption);
  } else {
    return find(options, ['value', value]) || null;
  }
}

export default class Control extends React.Component {
  didInitialSearch = false;

  static propTypes = {
    onChange: PropTypes.func.isRequired,
    forID: PropTypes.string.isRequired,
    value: PropTypes.node,
    field: ImmutablePropTypes.map,
    fetchID: PropTypes.string,
    query: PropTypes.func.isRequired,
    queryHits: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    classNameWrapper: PropTypes.string.isRequired,
    setActiveStyle: PropTypes.func.isRequired,
    setInactiveStyle: PropTypes.func.isRequired,
    hasActiveStyle: PropTypes.func,
  };

  async getOptions(term) {
    const { field } = this.props;
    const valueField = field.get('valueField');
    const displayField = field.get('displayField') || valueField;
    const searchField = field.get('searchField') || displayField;
    const url = field.get('url');
    const method = field.get('method') || 'GET';
    const dataKey = field.get('dataKey');
    const headers = field.get('headers') || {};

    const res = await fetch(url, {
      method,
      headers,
    })
      .then(data => data.json())
      .then(json => fromJS(json));

    let mappedData = res;

    // Allow for drill down.
    if (dataKey) {
      mappedData = res.get(dataKey);
    }

    let mappedOptions = mappedData.map(entry => ({
      value: entry.getIn(valueField.split('.')),
      label: entry.getIn(displayField.split('.')),
      data: entry,
    }));

    if (term) {
      mappedOptions = fuzzy
        .filter(term, mappedOptions, {
          extract: el => el.data.getIn(searchField.split('.')),
        })
        .sort((entryA, entryB) => entryB.score - entryA.score)
        .map(entry => entry.original);
    } else {
      mappedOptions = mappedOptions.toArray();
    }

    return mappedOptions;
  }

  componentDidUpdate(prevProps) {
    /**
     * Load extra post data into the store after first query.
     */
    if (this.didInitialSearch) return;
    const { value, field, forID, queryHits, onChange } = this.props;
    if (queryHits !== prevProps.queryHits && queryHits.get(forID)) {
      this.didInitialSearch = true;
      const valueField = field.get('valueField');
      const hits = queryHits.get(forID);
      if (value) {
        const listValue = List.isList(value) ? value : List([value]);
        listValue.forEach(val => {
          const hit = hits.find(i => i.data[valueField] === val);
          if (hit) {
            onChange(value, {
              [field.get('name')]: {
                [field.get('collection')]: { [val]: hit.data },
              },
            });
          }
        });
      }
    }
  }

  handleChange = selectedOption => {
    const { onChange, field } = this.props;
    let value;

    if (Array.isArray(selectedOption)) {
      value = selectedOption.map(optionToString);
      onChange(fromJS(value), {
        [field.get('name')]: {
          [field.get('collection')]: {
            [last(value)]:
              !isEmpty(selectedOption) && last(selectedOption).data,
          },
        },
      });
    } else {
      value = optionToString(selectedOption);
      onChange(value, {
        [field.get('name')]: {
          [field.get('collection')]: { [value]: selectedOption.data },
        },
      });
    }
  };

  parseHitOptions = hits => {
    const { field } = this.props;
    const valueField = field.get('valueField');
    const displayField = field.get('displayFields') || field.get('valueField');

    return hits.map(hit => ({
      data: hit.data,
      value: hit.data[valueField],
      label: List.isList(displayField)
        ? displayField
            .toJS()
            .map(key => hit.data[key])
            .join(' ')
        : hit.data[displayField],
    }));
  };

  loadOptions = debounce((term, callback) => {
    this.getOptions(term).then(options => {
      if (!this.allOptions && !term) {
        this.allOptions = options;
      }

      // TODO: Pagination
      // For now we return entire result set, assuming this is a rest or
      // graphql endpoint that can paginate for us.

      callback(options);
      // Refresh state to trigger a re-render.
      this.setState({ ...this.state });
    });
  }, 500);

  render() {
    const {
      value,
      field,
      forID,
      classNameWrapper,
      setActiveStyle,
      setInactiveStyle,
      queryHits,
    } = this.props;
    const isMultiple = field.get('multiple', false);
    const isClearable = !field.get('required', true) || isMultiple;

    const hits = queryHits.get(forID, []);
    const options = this.allOptions || this.parseHitOptions(hits);
    const selectedValue = getSelectedValue({
      options,
      value,
      isMultiple,
    });

    return (
      <AsyncSelect
        value={selectedValue}
        inputId={forID}
        defaultOptions
        loadOptions={this.loadOptions}
        onChange={this.handleChange}
        className={classNameWrapper}
        onFocus={setActiveStyle}
        onBlur={setInactiveStyle}
        styles={reactSelectStyles}
        isMulti={isMultiple}
        isClearable={isClearable}
        placeholder=""
      />
    );
  }
}
