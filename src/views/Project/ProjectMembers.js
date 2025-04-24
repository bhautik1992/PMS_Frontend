import React from "react";
import {Modal,ListGroup,ModalBody,ModalHeader,ListGroupItem} from 'reactstrap'
import { useState, useEffect, useRef } from 'react'
import axiosInstance from "../../helper/axiosInstance";
import toast from 'react-hot-toast'
import defaultAvatar from '../../../src/assets/images/profile/default.jpg';
import Avatar from '@components/avatar'

const ProjectMembers = ({ open, toggleMembers, row }) => {
    const [lists,setLists] = useState([]);

    useEffect(() => {
        if(open){
            (async() => {
                try {
                    const projectId = row._id;

                    const response = await axiosInstance.get('projects/team/'+projectId);

                    if(response.data.success){
                        setLists(response.data.data.users_id)
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
    },[open])

    return(
        <>
            <Modal isOpen={open} toggle={() => toggleMembers(!open)} className='modal-dialog-centered modal-lg'>
                <ModalHeader className='bg-transparent' toggle={() => toggleMembers(!open)}></ModalHeader>
                
                <ModalBody className='px-sm-5 mx-50 pb-4'>
                    <h1 className='text-center mb-1'>{row.name}</h1>
                    <p className='text-center'>Shared project with team members</p>
                                    
                    <p className='fw-bolder pt-50 mt-2'>{`${lists.length} Members`}</p>

                    <ListGroup flush className='mb-2'>
                        {lists.map((list, index) => (
                            <ListGroupItem key={list._id} className='d-flex align-items-start border-0 px-0'>                            
                                {list.profile_photo?
                                    <Avatar
                                        className='me-1'
                                        img={import.meta.env.VITE_BACKEND_ASSETS_URL+list.profile_photo}
                                        imgHeight={40} 
                                        imgWidth={40} 
                                    />
                                        : 
                                    <Avatar
                                        initials
                                        className='me-1'
                                        color={'light-primary'}
                                        content={`${list.first_name} ${list.last_name}`}
                                    />
                                }
                                
                                <div className='d-flex align-items-center justify-content-between w-100'>
                                    <div className='me-1'>
                                        <h5 className='mb-25'>{`${list.first_name} ${list.last_name} - ${list.role_id.name}`}</h5>
                                        <span>{list.company_email}</span>
                                    </div>
                                </div>
                            </ListGroupItem>
                        ))}
                    </ListGroup>
                </ModalBody>
            </Modal>
        </>
    )
}

export default ProjectMembers;


