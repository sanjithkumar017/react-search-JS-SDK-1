function setSelectedTextFacets(selectedTextFacets = {}) {
    this.setState((currentState) => {
        if (currentState.unbxdState.selectedTextFacets !== selectedTextFacets) {
            return {
                ...currentState,
                unbxdState: { ...currentState.unbxdState, selectedTextFacets }
            };
        } else {
            return null;
        }
    });
}

export default setSelectedTextFacets;
