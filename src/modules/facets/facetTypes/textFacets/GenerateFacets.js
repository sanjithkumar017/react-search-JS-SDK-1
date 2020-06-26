import React from 'react';
import PropTypes from 'prop-types';

import { isFacetSelected } from '../../utils';
import { List } from '../../../../components';
import FacetItem from './FacetItem';

class GenerateFacets extends React.Component {

    state = {};

    static getDerivedStateFromProps(props) {

        if (props.selectedFacets !== props.selectedFacetsAPI) {
            props.setSelectedFacets(props.isApplyFilters ?
                props.selectedFacets : props.selectedFacetsAPI);
        }

        return null;
    }

    render() {
        const { textFacets, selectedFacets, onFacetClick, onFacetObjectReset, FacetItemComponent } = this.props;
        return (<div>{textFacets.map(({ displayName, facetName, values }) => {

            //decide whether to show clear or not
            const hasActiveFacets = selectedFacets[facetName] ? true : false;

            return (<div key={facetName} className='UNX-facets-container text-facets'>

                <div className='UNX-facet-header'
                    data-unx_name={facetName}>
                    {displayName}

                    {hasActiveFacets && <div className='UNX-facet-header clear'
                        data-unx_name={facetName}
                        onClick={onFacetObjectReset}>
                        Clear
                </div>}

                </div>

                <div className='UNX-facet-list-container'>
                    <List items={values}
                        idAttribute={'dataId'}
                        ListItem={FacetItemComponent || FacetItem}
                        onClick={onFacetClick}
                        facetName={facetName}
                        className={'UNX-facet-item-container'}
                        isFacetSelected={isFacetSelected}
                        selectedFacets={selectedFacets}
                    />
                </div>
            </div>)
        })}
        </div>)
    }
}

GenerateFacets.propTypes = {
    textFacets: PropTypes.arrayOf(PropTypes.object),
    selectedFacets: PropTypes.object,
    selectedFacetsAPI: PropTypes.object,
    onFacetClick: PropTypes.func.isRequired,
    onFacetObjectReset: PropTypes.func.isRequired,
    setSelectedFacets: PropTypes.func.isRequired,
}

export default GenerateFacets;