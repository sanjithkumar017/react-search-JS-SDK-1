import React from 'react';
import PropTypes from 'prop-types';

import ProductsContainer from './ProductsContainer';
import { Loader as defaultLoader } from '../../components';
import { AppContextConsumer } from '../../common/context';
import { hasUnbxdSearchWrapperContext } from '../../common/utils';

/**
 * Component to manage products.
 * Products also manages the pagination options for the search results here.
 */
const Products = props => {
  return (
    <AppContextConsumer>
      {appState => {
        if (appState === undefined) {
          hasUnbxdSearchWrapperContext(Products.displayName);
        }

        const {
          unbxdCore,
          unbxdCoreStatus,
          helpers,
          unbxdState,
          priceUnit
        } = appState;
        const { viewType } = unbxdState;

        return (
          <ProductsContainer
            unbxdCore={unbxdCore}
            unbxdCoreStatus={unbxdCoreStatus}
            helpers={helpers}
            viewType={viewType}
            priceUnit={priceUnit}
            {...props}
          />
        );
      }}
    </AppContextConsumer>
  );
};

Products.displayName = 'Products';

Products.defaultProps = {
  perRow: 4,
  pageSize: 10,
  attributesMap: {},
  variantsCount: 5,
  variantAttributesMap: {},
  swatchAttributes: {},
  paginationType: 'FIXED_PAGINATION',
  heightDiffToTriggerNextPage: 100,
  showVariants: false,
  LoaderComponent: defaultLoader,
  showLoader: false,
  productIdAttribute: 'uniqueId'
};

Products.propTypes = {
  /**
   * Number of products to be shown per row.
   */
  perRow: PropTypes.number,
  /**
   * Number of products to be loaded on a page.
   */
  pageSize: PropTypes.number,
  /**
   * Required pagination type. Possible options are `INFINITE_SCROLL`, `CLICK_N_SCROLL` and `FIXED_PAGINATION`.
   */
  paginationType: PropTypes.string,
  /**
   * Height difference to trigger for next page in case of paginationType `INFINITE_SCROLL`.
   */
  heightDiffToTriggerNextPage: PropTypes.number,
  /**
   * Custom load more component for CLICK_N_SCROLL
   */
  LoadMoreComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  /**
   * Unique attribute of the product
   */
  productIdAttribute: PropTypes.string,
  /**
   * Mapping of catalog Product fields to SDK Product fields.
   */
  attributesMap: PropTypes.object.isRequired,
  /**
   * Show variants to a product.
   */
  showVariants: PropTypes.bool,
  /**
   * Number of variants to fetch.
   */
  variantsCount: PropTypes.number,
  /**
   * Mapping of catalog Product variant fields to SDK Product variant fields.
   */
  variantAttributesMap: PropTypes.object,
  /**
   * Should loader be shown
   */
  showLoader: PropTypes.bool,
  /**
   * Custom loader component
   */
  LoaderComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  /**
   * Callback function triggered on click of a product.
   */
  onProductClick: PropTypes.func,
  /**
   * Callback function triggered on zero results.
   */
  onZeroResults: PropTypes.func,
  /**
   * Display swatches
   */
  showSwatches: PropTypes.bool,
  /**
   * Group variants by the attribute
   */
  groupBy: PropTypes.string,
  /**
   * Swatch attributes that change on click on of the swatch
   */
  swatchAttributes: PropTypes.object,
  /**
   * Custom swatch component
   */
  SwatchItemComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  /**
   * Custom product item component
   */
  ProductItemComponent: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.func
  ]),
  /**
   *  Component to be shown in case of zero results.
   */
  ZeroResultsComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func])
};

export default Products;
