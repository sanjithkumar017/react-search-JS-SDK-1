import React from 'react';
import PropTypes from 'prop-types';
import { facetTypes } from '../../config';
import { conditionalRenderer } from '../../common/utils';
import { productTypes } from '../../config';
import { getFacetCoreMethods as getMultilevelFacetCoreMethods} from '../multilevelFacets/utils';
import {
    getTextFacetItem,
    getTextFacetFacetCoreMethods,
    getFormattedTextFacets
} from '../textFacets/utils';
import {
    getRangeFacetCoreMethods,
    getFormattedRangeFacets
} from '../rangeFacets/utils';
import { manageStateTypes } from '../../config';
import GenerateCombinedFacets from './generateCombinedFacets';
import { executeCallback } from '../../common/utils';

class CombinedFacetsContainer extends React.PureComponent {

    componentDidMount(){
        const {
            categoryDisplayName = '',
            categoryField = '',
            facetDepth,
            facetLimit,
            helpers: { setMultilevelFacetsConfiguration }
        } = this.props;

        setMultilevelFacetsConfiguration({
            categoryDisplayName,
            categoryField,
            facetDepth,
            facetLimit
        });
    }

    //a way to pass data to render props and our component
    getCombinedFacetsProps() {
        const {
            unbxdCore,
            unbxdCoreStatus,
            helpers: { manageTextFacets, setSelectedFacets },
            selectedFacets,
            textFacetItemComponent,
            enableApplyFilters,
            rangeFacetItemComponent,
            priceUnit,
            transform,
            collapsible,
            searchable,
            enableViewMore,
            minViewMore,
            label,
            onFacetClick,
            multiLevelfacetClick,
            multiLevelFacetItemComponent,
            productType
        } = this.props;

        const {
            getFacets,
            updateFacets,
            deleteAFacet,
            getSelectedFacet,
            getSelectedFacets,
            setPageStart,
            getResults
        } = getTextFacetFacetCoreMethods(unbxdCore);

        const {
            getRangeFacets,
            setRangeFacet,
            applyRangeFacet,
            clearARangeFacet,
            selectedRangeFacets
        } = getRangeFacetCoreMethods(unbxdCore);

        const {
            getBucketedFacets,
            getBreadCrumbsList,
            setCategoryFilter,
            deleteCategoryFilter,
        } = getMultilevelFacetCoreMethods(unbxdCore);

        // dfgerhgwerhgwerghwh
        const bucketedFacets = getBucketedFacets();

        const multilevelFacets = [];
        let highestBreadcrumbLevel = 0;
        

        let facetDisplayName = '';
        bucketedFacets.map((bucketedFacet) => {
            const {
                displayName,
                level,
                position,
                multiLevelField,
                facetName,
                filterField,
                values = []
            } = bucketedFacet;
            facetDisplayName = displayName;

            const breadCrumbsList = getBreadCrumbsList(filterField);
            highestBreadcrumbLevel = 0;

            const breadCrumbFacets = breadCrumbsList.map((breadcrumb) => {
                if (highestBreadcrumbLevel < breadcrumb.level) {
                    highestBreadcrumbLevel = breadcrumb.level;
                }
                return {
                    filterField: breadcrumb.filterField,
                    level: breadcrumb.level,
                    name: breadcrumb.value,
                    isSelected: true
                };
            });

            let formattedBucketedFacets = [];
            if (
                highestBreadcrumbLevel === level &&
                highestBreadcrumbLevel > 0
            ) {
                const lastBreadcrumb =
                    breadCrumbFacets[breadCrumbFacets.length - 1];
                const hit = values.find((facetValue) => {
                    const { name } = facetValue;
                    const { name: breadcrumbName } = lastBreadcrumb;
                    return breadcrumbName === name;
                });
                formattedBucketedFacets = [
                    {
                        ...hit,
                        filterField,
                        level,
                        isSelected: true
                    }
                ];
                breadCrumbFacets.pop();
            } else {
                formattedBucketedFacets = values.map((facetValue) => {
                    const { name, count, dataId } = facetValue;
                    return {
                        filterField,
                        level,
                        name,
                        count,
                        dataId
                    };
                });
            }

            const facet = {
                facetDisplayName,
                filterField,
                position,
                facetName,
                facetType: facetTypes.MULTILEVEL_FACET,
                values: [...breadCrumbFacets, ...formattedBucketedFacets]
            };
            multilevelFacets.push(facet);
        });

        //sgrwrherwherbnernre

        const handleMultiLevelFacetClick = (currentItem) => {
            const { name, filterField: parent, level } = currentItem;
            const categoryObject = { parent, level, name };
            const { helpers } = this.props;
            const { getUpdatedResults } = helpers;

            const onFinish = () => {
                const { setCategoryId } = unbxdCore;
                if (
                    productType === productTypes.CATEGORY &&
                    typeof setCategoryId === 'function'
                ) {
                    const getResults = setCategoryId(categoryObject, unbxdCore);
                    if (getResults) {
                        getUpdatedResults();
                    }
                } else {
                    if (highestBreadcrumbLevel === parseInt(level)) {
                        deleteCategoryFilter(categoryObject);
                    } else {
                        //check if it is a breadcrumb
                        const breadCrumbsList = getBreadCrumbsList(parent);
                        const hit = breadCrumbsList.find(({ value }) => {
                            return name === value;
                        });

                        if (hit) {
                            deleteCategoryFilter(categoryObject);
                        } else {
                            setCategoryFilter(categoryObject);
                        }
                    }
                    getResults();
                }
            };
            executeCallback(onFacetClick, [categoryObject], onFinish);
        };

        const textFacets = getFacets() || [];
        const lastSelectedFacets = getSelectedFacets();
        const applyMultiple = true;
        const rangeFacets = getRangeFacets() || [];

        const formattedTextFacets = getFormattedTextFacets(
            textFacets,
            selectedFacets
        );

        const formattedRangeFacets = getFormattedRangeFacets(
            rangeFacets,
            selectedRangeFacets
        );

        const combinedFacets = [
            ...formattedTextFacets,
            ...formattedRangeFacets,
            ...multilevelFacets
        ];

        combinedFacets &&
            combinedFacets.length &&
            combinedFacets.sort((a, b) => {
                return a.position - b.position;
            });

        //Methods to handle click on facets
        const removeTextFacet = ({
            selectedFacetName,
            selectedFacetId = null
        }) => {
            deleteAFacet(selectedFacetName, selectedFacetId);
        };

        const addTextFacet = ({
            selectedFacetName,
            selectedFacetId,
            facetData
        }) => {
            updateFacets({ selectedFacetName, selectedFacetId, facetData });
        };

        const handleTextFacetClick = (currentItem) => {
            const { facetName, dataId, isSelected = false } = currentItem;

            const facetData = getSelectedFacet(facetName);
            const { values: facetValues = [] } = facetData;

            //add or delete from state
            const facetRow = getTextFacetItem(facetValues, dataId);

            const onFinish = () => {
                enableApplyFilters &&
                    manageTextFacets(
                        facetRow,
                        facetName,
                        dataId,
                        isSelected
                            ? manageStateTypes.REMOVE
                            : manageStateTypes.ADD
                    );

                !isSelected &&
                    !enableApplyFilters &&
                    addFacet({
                        selectedFacetName: facetName,
                        selectedFacetId: dataId,
                        facetData
                    });
                isSelected &&
                    !enableApplyFilters &&
                    removeFacet({
                        selectedFacetName: facetName,
                        selectedFacetId: dataId
                    });
            };
            executeCallback(onFacetClick, [facetName, !isSelected], onFinish);
        };

        const handleTextFacetClear = (event) => {
            const { unx_name } = event.target.dataset;

            const onFinish = () => {
                if (enableApplyFilters) {
                    manageTextFacets(
                        null,
                        unx_name,
                        null,
                        manageStateTypes.RESET
                    );
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

        const data = {
            unbxdCoreStatus,
            combinedFacets,
            enableApplyFilters,
            lastSelectedFacets,
            selectedFacets,
            priceUnit,
            collapsible,
            searchable,
            enableViewMore,
            minViewMore,
            multiLevelFacetItemComponent
        };

        const helpers = {
            onTextFacetClick: handleTextFacetClick,
            onTextFacetClear: handleTextFacetClear,
            onMultiLevelFacetClick: handleMultiLevelFacetClick,
            setSelectedFacets,
            textFacetItemComponent,
            label,
            addRangeFacet,
            applyRangeFacet,
            removeRangeFacet,
            selectedRangeFacets,
            rangeFacetItemComponent,
            transform
        };

        return { ...data, ...helpers };
    }

    render() {
        const DefaultRender = GenerateCombinedFacets;

        return conditionalRenderer(
            this.props.children,
            this.getCombinedFacetsProps(),
            DefaultRender
        );
    }
}
CombinedFacetsContainer.propTypes = {
    unbxdCore: PropTypes.object.isRequired,
    unbxdCoreStatus: PropTypes.string.isRequired,
    helpers: PropTypes.object.isRequired,
    priceUnit: PropTypes.string.isRequired,
    enableApplyFilters: PropTypes.bool.isRequired,
    collapsible: PropTypes.bool,
    searchable: PropTypes.bool,
    textFacetItemComponent: PropTypes.element,
    rangeFacetItemComponent: PropTypes.element,
    transform: PropTypes.func,
    label: PropTypes.node,
    onFacetClick: PropTypes.node
};

export default CombinedFacetsContainer;
