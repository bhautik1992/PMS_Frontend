import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import DataTable from "react-data-table-component";
import { ChevronDown, PlusSquare, Edit, Trash, Eye } from "react-feather";
import Avatar from '@components/avatar'
import ReactPaginate from "react-paginate";
import { getTasks } from "../../services/actions/TasksAction";
import { Card, CardHeader, CardBody, CardTitle, Input, Label, Row, Col } from 'reactstrap'
import { Link  } from 'react-router-dom';
import '@styles/react/libs/tables/react-dataTable-component.scss';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

const TasksTable = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.LoginReducer);
    const { data: tasks, total } = useSelector((state) => state.TasksReducer);

    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchValue, setSearchValue] = useState("");

    useEffect(() => {
        if (user?._id) {
            dispatch(getTasks(user._id,currentPage, rowsPerPage, searchValue));
        }
    }, [dispatch, user, currentPage, rowsPerPage, searchValue]);

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

    const tableColumns = [
        {
            name: "#", 
            selector: (row, index) => (currentPage - 1) * rowsPerPage + index + 1,
            sortable: false, 
            width: "60px" 
        },
        {
            name: "Project Name", 
            width: '270px', 
            selector: (row) => row.project_name, 
            sortable: true, 
            // style: { 
            //     backgroundColor: '#95d9b4',
            // }
        },
        { 
            name: "Task Name", 
            width: '400px', 
            selector: (row) => row.name, 
            sortable: true,
            cell: (row) => (
                <div className="truncate-text">
                    {row.name}
                </div>
            )
        },
        {
            name: 'Employee Name',
            width: '270px',
            sortable: true,
            selector: (row) => row.user_name,
            cell: row => (
              <div className='d-flex align-items-center'>
                    <Avatar content={row.user_name} initials />
                
                    <div className='user-info text-truncate ms-1'>
                        <span className='d-block fw-bold text-truncate'>{row.user_name}</span>
                        <small>{row.company_email}</small>
                    </div>
              </div>
            )
        },
        { name: "Start Date", selector: (row) => row.start_date, sortable: true },
        { name: "End Date", selector: (row) => row.end_date, sortable: true },
        { name: "Hours", width:"130px", selector: (row) => row.hours, sortable: true },
        { 
            name: "Actions",
            ignoreRowClick: true,
            allowOverflow: true,
            cell: (row) => (
                <div className='d-flex'>
                    <Eye size={18} className="text-warning ms-1" onClick={() => viewRecord(row._id)} />
                    <Edit size={18} className="text-primary ms-1" onClick={() => editRecord(row._id)} />
                    <Trash size={18} className="text-danger ms-1" onClick={() => deleteRecord(row._id)} />
                </div>
            )
        }
    ];

    const viewRecord = (id) => {
        alert(id);
    }

    const editRecord = (id) => {
        alert(id);
    }

    const deleteRecord = (id) => {
        return MySwal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-outline-danger ms-1'
            },
            buttonsStyling: false
        }).then(function (result) {
            if(result.isConfirmed){
                alert(id);
            }
        })
    }

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
                textAlign     : 'center',
                justifyContent: 'center',
            },
        },
    };

    return (
        <>
            <Row>
                <Col sm='12'>
                    <Card className='overflow-hidden'>
                        <CardHeader className='border-bottom'>
                            <CardTitle tag='h4'>Tasks List</CardTitle>
                            
                            <div className='d-flex mt-md-0 mt-1'>
                                <Link to='/tasks/create' className='ms-2' color='primary' size='lg'>
                                    <PlusSquare size={25} />
                                </Link>
                            </div>
                        </CardHeader>
                        
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
                                columns={tableColumns}
                                sortIcon={<ChevronDown size={10} />}
                                paginationComponent={CustomPagination}
                                data={tasks}
                                customStyles={customStyles}
                                striped 
                                highlightOnHover
                                dense={true}
                                fixedHeader
                                fixedHeaderScrollHeight="577px"
                            />
                        </div>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default TasksTable;
