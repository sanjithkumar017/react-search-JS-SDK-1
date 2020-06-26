import React from 'react';
import PropTypes from 'prop-types';

import AppContext from '../../common/context'
import { PaginationContextProvider } from './context'
import Navigation from './navigation';
import NumberOfProducts from './numberOfProducts';
import { conditionalRenderer } from '../../common/utils';

class Pagination extends React.PureComponent {

    ProductContext = React.createContext();
    static contextType = AppContext;

    static NumberOfProducts = NumberOfProducts;
    static Navigation = Navigation;


    constructor(props) {
        super(props);

        const { pageSize } = this.props;
        this.state = {
            pageSize,
        }
    }

    componentDidMount() {
        const { helpers: { setPaginationConfiguration } } = this.context;

        const { pageSize } = this.props;

        //Set the main config
        setPaginationConfiguration({
            pageSize
        });
    }

    getPaginationProps() {

        const { unbxdCore, helpers: { setPaginationConfiguration, trackActions } } = this.context;
        const getPaginationInfo = unbxdCore.getPaginationInfo.bind(unbxdCore);
        const setPageStart = unbxdCore.setPageStart.bind(unbxdCore);
        const getResults = unbxdCore.getResults.bind(unbxdCore);

        const { PageSizeItemComponent, pageSizeOptions, pageSizeDisplayType } = this.props;

        const { currentPage = 0,
            isNext = false,
            isPrev = false,
            noOfPages = 0,
            rows = 0 } = getPaginationInfo() || {};

        const onPageSizeClick = (event) => {

            const pageSize = parseInt(event.target.dataset.unxpagesize) || parseInt(event.target.value);

            trackActions({ type: 'PAGE_SIZE', data: { pageSize } });
            this.setState({ pageSize })
            setPaginationConfiguration({
                pageSize
            }, true);

        }

        const onNextPageClick = () => {
            const newPageNumber = rows * currentPage;
            setPageStart(newPageNumber);
            getResults();

        }

        const onPreviousPageClick = () => {
            const newPageNumber = (currentPage - 2) * rows;
            setPageStart(newPageNumber);
            getResults();
        }

        const onPageClick = (event) => {
            const pageNo = parseInt(event.target.dataset.pagenumber);
            const newPageNumber = (pageNo - 1) * rows;
            setPageStart(newPageNumber);
            getResults();
        }


        const data = {
            isNext,
            isPrev,
            noOfPages,
            currentPage,
            pageSizeOptions,
            pageSizeDisplayType,
            ...this.state
        };

        const helpers = {
            PageSizeItemComponent,
            onPageSizeClick,
            onNextPageClick,
            onPreviousPageClick,
            onPageClick,
        };

        return {
            data, helpers
        }

    }

    render() {

        const DefaultRender = <React.Fragment>
            <NumberOfProducts />
            <Navigation />
        </React.Fragment>

        return (<PaginationContextProvider value={this.getPaginationProps()}>
            {conditionalRenderer(this.props.children, this.getPaginationProps(), DefaultRender)}
        </PaginationContextProvider>)
    }

}

Pagination.defaultProps = {
    pageSize: 10,
    pageSizeOptions: [{ id: 5, value: "5" }, { id: 10, value: "10" }, { id: 15, value: "15" }],
    pageSizeDisplayType: 'DROPDOWN',
    pagePadding: 2,
}

Pagination.propTypes = {
    pageSize: PropTypes.number.isRequired,
    pageSizeOptions: PropTypes.arrayOf(
        PropTypes.shape({ id: PropTypes.number, value: PropTypes.string }))
        .isRequired,
    pageSizeDisplayType: PropTypes.string.isRequired,
    PageSizeItemComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
    pagePadding: PropTypes.number
}

export default Pagination;