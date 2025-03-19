import { Card, CardHeader, CardBody, CardTitle, CardText, CardLink, Button } from "reactstrap";
import { Row, Col } from 'reactstrap'
import StatsHorizontal from '@components/widgets/stats/StatsHorizontal'
import { Trello, CheckCircle, PlusSquare, Lock } from 'react-feather'
import '@styles/react/apps/app-users.scss'
import { Link  } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getProjects } from '../../services/actions/ProjectsAction';

import CanAccess from "../../helper/CanAccess";
import { PERMISSION_ACTION } from "../../helper/constants";

const Index = () => {
    const { user } = useSelector((state) => state.LoginReducer);
    const { projects, activeProjects, closedProjects } = useSelector((state) => state.ProjectsReducer);
    const dispatch = useDispatch();

    const [counts,setCounts] = useState({
        total_projects : 0,
        active_projects: 0,
        closed_projects: 0,
    })

    useEffect(() => {
        if(user?._id){
            dispatch(getProjects(user._id))
        }
    },[user]);

    useEffect(() => {
        setCounts({
            total_projects: projects.length,
            active_projects: activeProjects.length,     
            closed_projects: closedProjects.length,     
        });
    }, [projects]);

    return (
        <>
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
                                    <Link to='/projects/create' className='me-1' size='lg' color='primary'>
                                        <PlusSquare size={25} />
                                    </Link>
                                </CardTitle>
                            </CanAccess>
                        </CardHeader>

                        <CardBody className='pt-1'>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default Index;


