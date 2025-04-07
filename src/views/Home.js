import { Card, CardHeader, CardBody, CardTitle, CardText, CardLink } from "reactstrap";
import { Helmet } from 'react-helmet-async';

const Home = () => {
    return (
        <div>
            <Helmet>
                <title>Dashboard | PMS</title>
            </Helmet>

            <Card>
                <CardHeader>
                    <CardTitle>Kick start your project 🚀</CardTitle>
                </CardHeader>
                
                <CardBody>
                    <CardText>All the best for your new project.</CardText>
                    <CardText>
                        Please make sure to read our{" "}
                        <CardLink
                            href="https://pixinvent.com/demo/vuexy-react-admin-dashboard-template/documentation/"
                            target="_blank"
                        >
                            Template Documentation
                        </CardLink>{" "}
                        to understand where to go from here and how to use our template.
                    </CardText>
                </CardBody>
            </Card>
        </div>
    );
};

export default Home;


