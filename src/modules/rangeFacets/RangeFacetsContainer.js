import React from 'react';
import PropTypes from 'prop-types';

import { conditionalRenderer } from '../../common/utils';
import GenerateFacets from './GenerateFacets';
import { getRangeFacetCoreMethods, getFormattedRangeFacets } from './utils';

class RangeFacetsContainer extends React.PureComponent {
    getRangeFacetsProps() {
        const {
            unbxdCore,
            facetItemComponent,
            enableApplyFilters,
            priceUnit,
            label,
            collapsible,
            onFacetClick,
            helpers,
            transform,
            enableViewMore,
            minViewMore,
            applyMultiple
        } = this.props;

        const {
            getRangeFacets,
            setRangeFacet,
            applyRangeFacet,
            clearARangeFacet,
            selectedRangeFacets
        } = getRangeFacetCoreMethods(unbxdCore);
        const { setSelectedRangeFacets } = helpers;

        const rangeFacets = getRangeFacets();

        const formattedRangeFacets = getFormattedRangeFacets(
            rangeFacets,
            selectedRangeFacets
        );

        const addRangeFacet = (
            { facetName, start, end },
            getResults = false
        ) => {
            setRangeFacet({ facetName, start, end, applyMultiple });
            if (getResults) {
                applyRangeFacet();
            }
        };

        const removeRangeFacet = ({ facetName }, getResults = false) => {
            clearARangeFacet(facetName);
            if (getResults) {
                applyRangeFacet();
            }
        };

        return {
            rangeFacets: formattedRangeFacets,
            addRangeFacet,
            applyRangeFacet,
            removeRangeFacet,
            facetItemComponent,
            enableApplyFilters,
            priceUnit,
            label,
            collapsible,
            transform,
            enableViewMore,
            onFacetClick,
            minViewMore,
            unbxdCore,
            applyMultiple
        };
    }

    render() {
        const DefaultRender = GenerateFacets;

        return conditionalRenderer(
            this.props.children,
            this.getRangeFacetsProps(),
            DefaultRender
        );
    }
}

RangeFacetsContainer.propTypes = {
    unbxdCore: PropTypes.object.isRequired,
    unbxdCoreStatus: PropTypes.string.isRequired,
    helpers: PropTypes.object.isRequired,
    facetItemComponent: PropTypes.element,
    enableApplyFilters: PropTypes.bool.isRequired,
    priceUnit: PropTypes.string.isRequired,
    label: PropTypes.node,
    collapsible: PropTypes.bool,
    applyMultiple: PropTypes.bool,
    onFacetClick: PropTypes.node
};

export default RangeFacetsContainer;
