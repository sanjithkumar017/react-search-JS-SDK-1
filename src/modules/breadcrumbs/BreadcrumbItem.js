import React from 'react';
import PropTypes from 'prop-types';

import { Button } from '../../components';

const BreadCrumbItem = ({
  itemData,
  Root,
  separator,
  breadCrumbsLength,
  onClick,
  idx
}) => {
  const { value, filterField, level } = itemData;
  const isLast = breadCrumbsLength - idx - 1 === 0;
  return (
    <>
      {idx === 0 && <Root />}
      {separator}
      <Button
        data-unx_categoryname={value}
        data-unx_multilevelfield={filterField}
        data-unx_level={level}
        className={'UNX-breadcrumb__item'}
        onClick={isLast ? null : onClick}
      >
        {value}
      </Button>
    </>
  );
};

BreadCrumbItem.propTypes = {
  itemData: PropTypes.shape({
    value: PropTypes.string,
    level: PropTypes.number,
    filterField: PropTypes.string
  }).isRequired,
  Root: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.func,
    PropTypes.node
  ]),
  separator: PropTypes.node,
  breadCrumbsLength: PropTypes.number,
  onClick: PropTypes.func.isRequired,
  idx: PropTypes.number
};

export default BreadCrumbItem;
