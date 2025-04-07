import { Card, CardHeader, CardBody, CardTitle, CardText, CardLink, Button } from "reactstrap";
import { Row, Col } from 'reactstrap'
import StatsHorizontal from '@components/widgets/stats/StatsHorizontal'
import { Trello, CheckCircle, PlusSquare, Lock } from 'react-feather'
import '@styles/react/apps/app-users.scss'
import { Link  } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getProjects } from '../../services/actions/ProjectsAction';
import { getClients } from '../../services/actions/ClientsAction';
import DataTableComponent from '../Table/DataTableComponent';
import { projectsTableColumn } from '../Table/Columns';

import CanAccess from "../../helper/CanAccess";
import { PERMISSION_ACTION } from "../../helper/constants";

import { projectsExpColumns } from '../Table/Columns';
import { Helmet } from 'react-helmet-async';

const Index = () => {
    const { user } = useSelector((state) => state.LoginReducer);
    const { projects, activeProjects, closedProjects } = useSelector((state) => state.ProjectsReducer);
    const dispatch = useDispatch();

    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchValue, setSearchValue] = useState("");

    const [counts,setCounts] = useState({
        total_projects : 0,
        active_projects: 0,
        closed_projects: 0,
    })

    useEffect(() => {
        if(user?._id){
            dispatch(getProjects(user._id))
            dispatch(getClients())
        }
    },[user]);

    useEffect(() => {
        setCounts({
            total_projects: projects.length,
            active_projects: activeProjects.length,     
            closed_projects: closedProjects.length,     
        });
    }, [projects]);

    const tableColumn = useMemo(() => projectsTableColumn(currentPage,rowsPerPage),[currentPage,rowsPerPage])

    return (
        <>
        
            <Helmet>
                <title>Projects | PMS</title>
            </Helmet>

            <div className='app-user-list'>
                <Row>
                    <Col lg='3' sm='6'>
                        <StatsHorizontal
                            color='primary'
                            statTitle='Total Projects'
                            icon={<Trello size={20} />}
                            renderStats={<h3 className='fw-bolder mb-75'> {counts.total_projects} </h3>}
                        />
                    </Col>
            
                    <Col lg='3' sm='6'>
                        <StatsHorizontal
                            color='success'
                            statTitle='Active Projects'
                            icon={<CheckCircle size={20} />}
                            renderStats={<h3 className='fw-bolder mb-75'> {counts.active_projects} </h3>}
                        />
                    </Col>

                    <Col lg='3' sm='6'>
                        <StatsHorizontal
                            color='secondary'
                            statTitle='Closed Projects'
                            icon={<Lock size={20} />}
                            renderStats={<h3 className='fw-bolder mb-75'> {counts.closed_projects} </h3>}
                        />
                    </Col>
                </Row>
            </div>

            <Row>
                <Col xs={12}>
                    <Card>
                        <CardHeader className='border-bottom'>
                            <CardTitle tag='h4'>Projects List</CardTitle>

                            <CanAccess permission={PERMISSION_ACTION.PROJECT_CREATE}>
                                <CardTitle tag='h4'>
                                    <Link to='/project/create' className='me-1' size='lg' color='primary'>
                                        <PlusSquare size={25} />
                                    </Link>
                                </CardTitle>
                            </CanAccess>
                        </CardHeader>

                        <DataTableComponent
                            columns={tableColumn}
                            data={projects}
                            total={projects.length}
                            currentPage={currentPage}
                            rowsPerPage={rowsPerPage}
                            searchValue={searchValue}
                            setCurrentPage={setCurrentPage}
                            setRowsPerPage={setRowsPerPage}
                            setSearchValue={setSearchValue}
                            expandableColumns={projectsExpColumns}
                            isExpandable={true}
                        />

                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default Index;


