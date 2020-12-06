function setSelectedRangeFacets(selectedRangeFacets = {}) {
    this.setState((currentState) => {
        if (currentState.unbxdState.selectedRangeFacets !== selectedRangeFacets) {
            return {
                ...currentState,
                unbxdState: { ...currentState.unbxdState, selectedRangeFacets }
            };
        } else {
            return null;
        }
    });
}

export default setSelectedRangeFacets;
