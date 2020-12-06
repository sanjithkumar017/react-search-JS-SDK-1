import { manageStateTypes } from '../config';

function manageRangeFacets(
    currentFacet = {},
    selectedFacetName = '',
    selectedFacetId = 0,
    action
) {
    this.setState((appState) => {
        const { unbxdState, ...remaningState } = appState;
        const { selectedRangeFacets } = unbxdState;
        let updatedSelectedFacets;
        switch (action) {
            case manageStateTypes.ADD:
                {
                    const {
                        [selectedFacetName]: currentFacetListAdd = [],
                        ...remainingStateAdd
                    } = selectedRangeFacets;
                    const updatedFacetArrayAdd = [
                        ...currentFacetListAdd,
                        currentFacet
                    ];
                    updatedSelectedFacets = {
                        ...remainingStateAdd,
                        [selectedFacetName]: updatedFacetArrayAdd
                    };
                }
                break;

            case manageStateTypes.REMOVE:
                {
                    const {
                        [selectedFacetName]: currentFacetListRemove = [],
                        ...remainingStateRemove
                    } = selectedRangeFacets;
                    const updatedFacetArrayRemove = currentFacetListRemove.filter(
                        (fValue) => fValue.dataId != selectedFacetId
                    );
                    updatedSelectedFacets = updatedFacetArrayRemove.length
                        ? {
                              ...remainingStateRemove,
                              [selectedFacetName]: updatedFacetArrayRemove
                          }
                        : { ...remainingStateRemove };
                }
                break;

            case manageStateTypes.RESET: {
                const {
                    // eslint-disable-next-line no-unused-vars
                    [selectedFacetName]: ignoreCurrentFacetList,
                    ...remainingStateReset
                } = selectedRangeFacets;
                updatedSelectedFacets = remainingStateReset;
                break;
            }
            case manageStateTypes.CLEAR: {
                updatedSelectedFacets = {};
                break;
            }
            default:
                return null;
        }

        return {
            ...remaningState,
            unbxdState: {
                ...unbxdState,
                selectedRangeFacets: updatedSelectedFacets
            }
        };
    });
}

export default manageRangeFacets;
