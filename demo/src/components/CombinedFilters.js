import React from 'react';

import { CombinedFacets } from '@unbxd-ui/react-search-sdk';
import { FacetItemComponent as TextFacetItemComponent } from './TextFilters';
import { FacetItemComponent as MultiLevelItemComponent } from './MultilevelFilters';
import { onFacetClick as multiLevelfacetClick } from './MultilevelFilters';
import { FacetItemComponent as RangeFacetItemComponent } from './RangeFilters';

const transform = function () {
    console.log(this);
    return this;
};

const CombinedFilters = () => {
    return (
        <CombinedFacets
            transform={transform}
            rangeFacetItemComponent={<RangeFacetItemComponent />}
            textFacetItemComponent={<TextFacetItemComponent />}
            multiLevelFacetItemComponent={<MultiLevelItemComponent />}
            multiLevelfacetClick={multiLevelfacetClick}
            collapsible={true}
            enableViewMore={true}
            searchable={true}
            minViewMore={3}
        />
    );
};

export default CombinedFilters;
