import { Card, CardHeader, CardTitle } from "reactstrap";
import { Helmet } from 'react-helmet-async';
import { PlusSquare } from "react-feather";
import { Link  } from 'react-router-dom';
import CanAccess from '../../helper/CanAccess';
import { PERMISSION_ACTION } from '../../helper/constants';

const Index = () => {
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
            </Card>
        </div>
    );
};

export default Index;


