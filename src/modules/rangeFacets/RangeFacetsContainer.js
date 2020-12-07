import React from 'react';
import PropTypes from 'prop-types';

import { conditionalRenderer, executeCallback } from '../../common/utils';
import GenerateFacets from './GenerateFacets';
import { manageStateTypes } from '../../config';
import { getRangeFacetCoreMethods, getFormattedRangeFacets } from './utils';

class RangeFacetsContainer extends React.PureComponent {
    componentDidMount() {
        const { helpers, applyMultiple } = this.props;
        const { setRangeFacetsConfiguration } = helpers;
        setRangeFacetsConfiguration({ applyMultiple });
    }
    getRangeFacetsProps() {
        const {
            unbxdCore,
            facetItemComponent,
            enableApplyFilters,
            selectedRangeFacets,
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
            lastSelectedRangeFacets
        } = getRangeFacetCoreMethods(unbxdCore);
        const { setSelectedRangeFacets, manageRangeFacets } = helpers;

        const rangeFacets = getRangeFacets();

        // const parsedSelectedRangeFacets = getSelectedRangeFacets(
        //     selectedRangeFacets
        // );
        const formattedRangeFacets = getFormattedRangeFacets(
            rangeFacets,
            selectedRangeFacets
        );

        const handleFacetClick = (currentItem) => {
            const {
                from,
                end,
                facetName,
                id,
                isSelected = false
            } = currentItem;
            const { dataId: valMin } = from;
            const { dataId: valMax } = end;

            const facetObj = { facetName, valMin, valMax, isSelected, id };

            const onFinish = () => {
                enableApplyFilters &&
                    manageRangeFacets(
                        facetObj,
                        facetName,
                        id,
                        isSelected
                            ? manageStateTypes.REMOVE
                            : manageStateTypes.ADD
                    );

                !isSelected &&
                    !enableApplyFilters &&
                    addFacet({
                        facetName,
                        start: valMin,
                        end: valMax
                    });
                isSelected &&
                    !enableApplyFilters &&
                    removeFacet({
                        facetName
                    });
            };
            executeCallback(onFacetClick, [facetObj, !isSelected], onFinish);
        };

        const handleFacetObjectReset = (event) => {
            const { unx_name } = event.target.dataset;

            const onFinish = () => {
                if (enableApplyFilters) {
                    manageRangeFacets(unx_name, manageStateTypes.RESET);
                }

                if (!enableApplyFilters) {
                    removeFacet({ selectedFacetName: unx_name });
                    setPageStart(0);
                    getResults();
                }
            };
            executeCallback(onFacetClick, [unx_name], onFinish);
        };

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
            onFacetClick: handleFacetClick,
            onFacetObjectReset: handleFacetObjectReset,
            handleFacetObjectReset,
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
