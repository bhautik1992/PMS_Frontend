import DataTable from "react-data-table-component";
import ReactPaginate from "react-paginate";
import { ChevronDown } from "react-feather";
import { Input, Row, Col } from 'reactstrap'
import '@styles/react/libs/tables/react-dataTable-component.scss';

const DataTableComponent = ({ columns, data, total, currentPage, rowsPerPage, searchValue, setCurrentPage, setRowsPerPage, setSearchValue, isExpandable, expandableColumns }) => {
    const CustomPagination = () => {
        const count = Math.ceil(total / rowsPerPage)
        
        return (
            <ReactPaginate
                previousLabel={''}
                nextLabel={''}
                breakLabel="..."
                pageCount={Math.ceil(count) || 1}
                marginPagesDisplayed={2}
                pageRangeDisplayed={2}
                activeClassName="active"
                forcePage={currentPage !== 0 ? currentPage - 1 : 0}
                onPageChange={page => handlePagination(page)}
                pageClassName='page-item'
                breakClassName='page-item'
                nextLinkClassName='page-link'
                pageLinkClassName='page-link'
                breakLinkClassName='page-link'
                previousLinkClassName='page-link'
                nextClassName='page-item next-item'
                previousClassName='page-item prev-item'
                containerClassName={
                    "pagination react-paginate separated-pagination pagination-sm justify-content-end pe-1 mt-1"
                }
            />
        );
    };

    const customStyles = {
        headCells: {
            style: {
                textAlign: 'center',
                justifyContent: 'center',
            },
        },
    };

    const handlePagination = (page) => {
        setCurrentPage(page.selected + 1);
    };

    const handlePerPage = (e) => {
        setRowsPerPage(parseInt(e.target.value));
    };

    const handleSearch = (e) => {
        setSearchValue(e.target.value);
        setCurrentPage(1);
    };

    return (
        <>
            {/* Filter */}
            <div className='invoice-list-table-header w-100 me-1 ms-50 mt-2 mb-75'>
                <Row>
                    <Col xl='6' className='d-flex align-items-center p-0'>
                        <div className='d-flex align-items-center w-100'>
                            <Input
                                type='select'
                                id='sort-select'
                                className='mx-50 dataTable-select ms-1'
                                value={rowsPerPage}
                                onChange={e => handlePerPage(e)}
                                style={{ width: '5rem' }}
                            >
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </Input>
                        </div>
                    </Col>

                    <Col xl='6' className='d-flex align-items-sm-center justify-content-xl-end justify-content-start flex-xl-nowrap flex-wrap flex-sm-row flex-column pe-xl-1 p-0 mt-xl-0 mt-1'>
                        <div className='d-flex align-items-center mb-sm-0 mb-1 me-1'>
                            <label className='mb-0' htmlFor='search-invoice'>
                                Search:
                            </label>

                            <Input
                                type='text'
                                id='search-input'
                                className='ms-50 w-100 dataTable-filter'
                                value={searchValue}
                                onChange={handleSearch}
                            />
                        </div>
                    </Col>
                </Row>
            </div>

            <div className='react-dataTable'>
                <DataTable
                    noHeader
                    pagination
                    paginationServer
                    className='react-dataTable'
                    columns={columns}
                    sortIcon={<ChevronDown size={10} />}
                    paginationComponent={CustomPagination}
                    data={data}
                    customStyles={customStyles}
                    striped 
                    highlightOnHover
                    dense={true}
                    fixedHeader
                    fixedHeaderScrollHeight="577px"
                    {...(isExpandable && {
                        expandableRows: true,
                        expandOnRowClicked: true,
                        expandableRowsComponent: expandableColumns
                    })}
                />
            </div>
        </>
    );
};

export default DataTableComponent;


