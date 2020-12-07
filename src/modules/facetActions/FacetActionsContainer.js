import React from 'react';
import PropTypes from 'prop-types';

import { conditionalRenderer } from '../../common/utils';
import { getFacetCoreMethods } from './utils';
import { manageStateTypes } from '../../config';
import FacetActionsWrapper from './FacetActionsWrapper';
import { executeCallback } from '../../common/utils';

class FacetActionsContainer extends React.PureComponent {
    componentDidMount() {
        const {
            helpers: { setFacetsActionConfiguration }
        } = this.props;
        setFacetsActionConfiguration({ enable: true });
    }

    //a way to pass data to render props and our component
    getFacetActionsProps() {
        const {
            unbxdCore,
            showApplyFilter,
            showClearFilter,
            applyFilterComponent,
            clearFilterComponent,
            selectedTextFacets,
            selectedRangeFacets,
            applyMultiple,
            helpers: { manageTextFacets, manageRangeFacets },
            onApply,
            onClear
        } = this.props;

        const {
            applyFacets,
            clearFacets,
            lastSelectedRangeFacets,
            setRangeFacet,
            applyRangeFacet,
            clearARangeFacet,
            getPaginationInfo
        } = getFacetCoreMethods(unbxdCore);

        const { noOfPages = 0 } = getPaginationInfo() || {};

        const handleApplyFilter = () => {
            const onFinish = () => {
                //apply range facets one by one
                Object.keys(selectedRangeFacets).map((facetName) => {
                    selectedRangeFacets[facetName].map((facetItem) => {
                        const { valMin, valMax } = facetItem;
                        setRangeFacet({
                            facetName,
                            start: valMin,
                            end: valMax,
                            applyMultiple
                        });
                    });
                });
                applyRangeFacet();
                //does not work if we pass it as it is.
                applyFacets({ ...selectedTextFacets });
            };
            executeCallback(
                onApply,
                [selectedTextFacets, selectedRangeFacets],
                onFinish
            );
        };

        const handleClearFilter = () => {
            const onFinish = () => {
                Object.keys(lastSelectedRangeFacets).map((rangeFacetName) => {
                    clearARangeFacet(rangeFacetName);
                });
                clearFacets();
                manageTextFacets(null, null, null, manageStateTypes.CLEAR);
            };
            executeCallback(onClear, [selectedTextFacets], onFinish);
        };

        return {
            showApplyFilter,
            showClearFilter,
            onApplyFilter: handleApplyFilter,
            onClearFilter: handleClearFilter,
            noOfPages,
            applyFilterComponent,
            clearFilterComponent
        };
    }

    render() {
        const DefaultRender = FacetActionsWrapper;

        return conditionalRenderer(
            this.props.children,
            this.getFacetActionsProps(),
            DefaultRender
        );
    }
}

FacetActionsContainer.propTypes = {
    unbxdCore: PropTypes.object.isRequired,
    unbxdCoreStatus: PropTypes.string.isRequired,
    helpers: PropTypes.object.isRequired,
    selectedTextFacets: PropTypes.object,
    showApplyFilter: PropTypes.bool,
    showClearFilter: PropTypes.bool,
    applyFilterComponent: PropTypes.element,
    clearFilterComponent: PropTypes.element,
    onApply: PropTypes.func,
    onClear: PropTypes.func
};

export default FacetActionsContainer;
