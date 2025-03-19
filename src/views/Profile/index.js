import { Fragment, useState } from 'react'
import { Row, Col, TabContent, TabPane } from 'reactstrap'
import Tabs from './Tabs'
import AccountTabContent from './AccountTabContent'
import SecurityTabContent from './SecurityTabContent'
import BankDetailsTabContent from './BankDetailsTabContent'

import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/pages/page-account-settings.scss'

import CanAccess from '../../helper/CanAccess'
import { PERMISSION_ACTION } from '../../helper/constants'

const Index = () => {
    const [activeTab, setActiveTab] = useState('1')
  
    const toggleTab = tab => {
        setActiveTab(tab)
    }

    return (
        <Fragment>
            <Row>
                <Col xs={12}>
                    <Tabs className='mb-2' activeTab={activeTab} toggleTab={toggleTab} />
                    <TabContent activeTab={activeTab}>
                        <CanAccess permission={PERMISSION_ACTION.ACCOUNT}>
                            <TabPane tabId='1'>
                                <AccountTabContent />
                            </TabPane>
                        </CanAccess>
                        
                        <CanAccess permission={PERMISSION_ACTION.SECURITY}>
                            <TabPane tabId='2'>
                                <SecurityTabContent />
                            </TabPane>
                        </CanAccess>

                        <CanAccess permission={PERMISSION_ACTION.BANK_DETAILS}>
                            <TabPane tabId='3'>
                                <BankDetailsTabContent />
                            </TabPane>
                        </CanAccess>
                    </TabContent>
                </Col>
            </Row>
        </Fragment>
    )
}

export default Index;