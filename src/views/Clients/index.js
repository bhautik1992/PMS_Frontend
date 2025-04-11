import { Card, CardHeader, CardTitle } from "reactstrap";
import { Helmet } from 'react-helmet-async';
import { PlusSquare } from "react-feather";
import { Link  } from 'react-router-dom';
import CanAccess from '../../helper/CanAccess';
import { PERMISSION_ACTION } from '../../helper/constants';
import { useEffect, useState, useMemo } from 'react';
import DataTableComponent from '../Table/DataTableComponent';
import { clientsTableColumn } from '../Table/Columns';
import { clientListing } from '../../services/actions/ClientsAction';
import { useSelector, useDispatch } from "react-redux";

const Index = () => {
    const dispatch = useDispatch();
    const { listing, total } = useSelector((state) => state.ClientsReducer);

    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchValue, setSearchValue] = useState("");

    useEffect(() => {
        dispatch(clientListing());
    },[]);

    const tableColumn = useMemo(() => clientsTableColumn(currentPage,rowsPerPage),[currentPage,rowsPerPage])

    return (
        <div>
            <Helmet>
                <title>Clients | PMS</title>
            </Helmet>

            <Card>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4'>Clients List</CardTitle>

                    <CanAccess permission={PERMISSION_ACTION.CLIENT_CREATE}>
                        <div className='d-flex mt-md-0 mt-1'>
                            <Link to='/client/create' className='ms-2' color='primary' size='lg'>
                                <PlusSquare size={25} />
                            </Link>
                        </div>
                    </CanAccess>
                </CardHeader>

                <DataTableComponent
                    columns={tableColumn}
                    data={listing}
                    total={total}
                    currentPage={currentPage}
                    rowsPerPage={rowsPerPage}
                    searchValue={searchValue}
                    setCurrentPage={setCurrentPage}
                    setRowsPerPage={setRowsPerPage}
                    setSearchValue={setSearchValue}
                />
            </Card>
        </div>
    );
};

export default Index;


