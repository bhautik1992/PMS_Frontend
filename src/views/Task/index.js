import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { PlusSquare } from "react-feather";
import { getTasks } from "../../services/actions/TasksAction";
import { Card, CardHeader, CardBody, CardTitle, Row, Col, Label } from 'reactstrap'
import { Link  } from 'react-router-dom';

import DataTableComponent from '../Table/DataTableComponent';
import { taskTableColumn } from '../Table/Columns';

import CanAccess from "../../helper/CanAccess";
import { PERMISSION_ACTION } from "../../helper/constants";

import { Helmet } from 'react-helmet-async';

import Select from 'react-select'
import { selectThemeColors } from '@utils'
import axiosInstance from  '../../helper/axiosInstance';
import toast from 'react-hot-toast'

const TasksTable = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.LoginReducer);
    const { data: tasks, total } = useSelector((state) => state.TasksReducer);

    const [componentVal, setComponentVal] = useState({
        projectsOptions: [],
        userOptions    : [],
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchValue, setSearchValue] = useState("");
    const [filter, setFilter] = useState([]);

    useEffect(() => {
        if(user?._id){
            (async() => {
                try {
                    const userId = user._id;
    
                    const response = await axiosInstance.get('tasks/filter',{
                        params: { 
                            id:userId 
                        }
                    });
                    
                    if(response.data.success){
                        const options = response.data.data.projects.map((val,key) => ({
                            label: val.name,    
                            value: val._id, 
                        })) 
                
                        setComponentVal(prevVal => ({
                            ...prevVal,
                            projectsOptions:options
                        }))

                        const options1 = response.data.data.reporting.map((val,key) => ({
                            label: val.first_name+' '+val.last_name,
                            value: val._id, 
                        })) 
                
                        setComponentVal(prevVal => ({
                            ...prevVal,
                            userOptions:options1
                        }))
                    }
                } catch (error) {
                    let errorMessage = import.meta.env.VITE_ERROR_MSG;
        
                    if(error.response){
                        errorMessage = error.response.data?.message || JSON.stringify(error.response.data); // Case 1: API responded with an error
                    }else if (error.request){
                        errorMessage = import.meta.env.VITE_NO_RESPONSE; // Case 2: Network error
                    }
            
                    // console.error(error.message);
                    toast.error(errorMessage);
                }
            })();
        }
    },[user])

    useEffect(() => {
        if (user?._id) {
            dispatch(getTasks(user._id,currentPage, rowsPerPage, searchValue, filter));
        }
    }, [dispatch, user, currentPage, rowsPerPage, searchValue, filter]);

    const handleChange = (type,info) => {
        setFilter(prevFilters => {
            const existingIndex = prevFilters.findIndex(f => f.type === type);
        
            if (info === null) {
                // Remove filter if option was cleared
                return prevFilters.filter(f => f.type !== type);
            }
        
            if (existingIndex !== -1) {
                const updatedFilters = [...prevFilters];
                updatedFilters[existingIndex] = { type, value: info.value };
                return updatedFilters;
            } else {
                return [...prevFilters, { type, value: info.value }];
            }
        });        
    }

    const tableColumn = useMemo(() => taskTableColumn(currentPage,rowsPerPage),[currentPage,rowsPerPage])
    
    return (
        <>
            <Helmet>
                <title>Tasks | PMS</title>
            </Helmet>

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
                        
                        <CardBody>
                            <Row className='mt-1 mb-50'>
                                <Col lg='3' md='6' className='mb-1'>
                                    <Label className='form-label' for='project_id'>
                                        Select Project
                                    </Label>

                                    <Select
                                        name="project_id"
                                        id="project_id"
                                        theme={selectThemeColors}
                                        className="react-select"
                                        classNamePrefix='select'
                                        options={componentVal.projectsOptions}
                                        onChange={(option) => handleChange("project", option)}
                                        isClearable
                                    />
                                </Col>

                                <Col lg='3' md='6' className='mb-1'>
                                    <Label className='form-label' for='user_id'>
                                        Assigned To:
                                    </Label>

                                    <Select
                                        name="user_id"
                                        id="user_id"
                                        theme={selectThemeColors}
                                        className="react-select"
                                        classNamePrefix='select'
                                        options={componentVal.userOptions}
                                        onChange={(option) => handleChange("assignedto", option)}
                                        isClearable
                                    />
                                </Col>

                                {/* <Col lg='3' md='6' className='mb-1'>
                                    <Label className='form-label' for='email'>
                                        Start Date:
                                    </Label>
                                </Col>

                                <Col lg='3' md='6' className='mb-1'>
                                    <Label className='form-label' for='post'>
                                        End Date:
                                    </Label>
                                </Col> */}
                            </Row>
                        </CardBody>

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


