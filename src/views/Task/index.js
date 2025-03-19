import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { PlusSquare } from "react-feather";
import { getTasks } from "../../services/actions/TasksAction";
import { Card, CardHeader, CardTitle, Row, Col } from 'reactstrap'
import { Link  } from 'react-router-dom';

import DataTableComponent from '../Table/DataTableComponent';
import { taskTableColumn } from '../Table/Columns';

import CanAccess from "../../helper/CanAccess";
import { PERMISSION_ACTION } from "../../helper/constants";

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

    const tableColumn = useMemo(() => taskTableColumn(currentPage,rowsPerPage),[currentPage,rowsPerPage])
    
    return (
        <>
            <Row>
                <Col sm='12'>
                    <Card className='overflow-hidden'>
                        <CardHeader className='border-bottom'>
                            <CardTitle tag='h4'>Tasks List</CardTitle>
                            
                            <CanAccess permission={PERMISSION_ACTION.TASK_CREATE}>
                                <div className='d-flex mt-md-0 mt-1'>
                                    <Link to='/tasks/create' className='ms-2' color='primary' size='lg'>
                                        <PlusSquare size={25} />
                                    </Link>
                                </div>
                            </CanAccess>
                        </CardHeader>
                        
                        <DataTableComponent
                            columns={tableColumn}
                            data={tasks}
                            total={total}
                            currentPage={currentPage}
                            rowsPerPage={rowsPerPage}
                            searchValue={searchValue}
                            setCurrentPage={setCurrentPage}
                            setRowsPerPage={setRowsPerPage}
                            setSearchValue={setSearchValue}
                        />
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default TasksTable;


