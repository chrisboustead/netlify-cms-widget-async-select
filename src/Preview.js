import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

export default function Preview(props) {
  const { field, value } = props;
  let displayValue = props.value;

  if (field.get('multiple')) {
    displayValue = value.join(', ');
  }
  return <div>{displayValue}</div>;
}

Preview.propTypes = {
  value: PropTypes.node,
  field: ImmutablePropTypes.map,
};
