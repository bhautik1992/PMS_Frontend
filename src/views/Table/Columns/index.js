import Avatar from '@components/avatar'
import Actions from '../Actions';
import { MODULES } from '../constants';
import { Badge } from 'reactstrap'

export const taskTableColumn = (currentPage, rowsPerPage) => [
    {
        name: "#", 
        selector: (row, index) => (currentPage - 1) * rowsPerPage + index + 1,
        sortable: false, 
        width: "60px" 
    },
    { 
        name: "Task Name", 
        width: '300px', 
        selector: (row) => row.name, 
        sortable: true,
        cell: (row) => (
            <div className="truncate-text">
                {row.name}
            </div>
        )
    },
    {
        name: "Project Name", 
        width: '300px', 
        selector: (row) => row.project_name, 
        sortable: true, 
        // style: { 
        //     backgroundColor: '#95d9b4',
        // }
    },
    // {
    //     name: 'Employee Name',
    //     width: '300px',
    //     sortable: true,
    //     selector: (row) => row.user_name,
    //     cell: row => (
    //       <div className='d-flex align-items-center'>
    //             <Avatar content={row.user_name} initials />
            
    //             <div className='user-info text-truncate ms-1'>
    //                 <span className='d-block fw-bold text-truncate'>{row.user_name}</span>
    //                 <small>{row.company_email}</small>
    //             </div>
    //       </div>
    //     )
    // },
    { name: "Start Date", selector: (row) => row.start_date, sortable: true },
    { name: "End Date", selector: (row) => row.end_date, sortable: true },
    { 
        name: "Hours", 
        width:"115px", 
        sortable: true,
        selector: (row) => row.hours, 
        cell: row => (
            <>
                {`${row.hours} (${row.total_logged_hours})`}
            </>
        )
    },
    { 
        name: "Actions",
        ignoreRowClick: true,
        allowOverflow: true,
        cell: (row) => (
            <div className='d-flex'>
                <Actions row={row} module={MODULES.TASKS} />
            </div>
        )
    }
];

export const rolesTableColumn = (currentPage, rowsPerPage, handleRolePermission) => [
    {
        name: "#", 
        selector: (row, index) => (currentPage - 1) * rowsPerPage + index + 1,
        sortable: false, 
        width: "60px" 
    },
    { 
        name: "Name",
        selector: (row) => row.name, 
        sortable: true,
        cell: (row) => (
            <>
                {row.name}
            </>
        )
    },
    { 
        name: "Created At",
        selector: (row) => row.createdAt, 
        sortable: true,
        cell: (row) => (
            <>
                {row.createdAt}
            </>
        )
    },
    { 
        name: "Actions",
        ignoreRowClick: true,
        allowOverflow: true,
        cell: (row) => (
            <div className='d-flex'>
                <Actions row={row} module={MODULES.ROLES} handleRolePermission={handleRolePermission}/>
            </div>
        )
    }
];

export const permissionsTableColumn = (currentPage, rowsPerPage) => [
    {
        name: "#", 
        selector: (row, index) => (currentPage - 1) * rowsPerPage + index + 1,
        sortable: false, 
        width: "60px" 
    },
    { 
        name: "Name",
        selector: (row) => row.name, 
        sortable: true,
        cell: (row) => (
            <>
                {row.name}
            </>
        )
    },
    { 
        name: "Action",
        selector: (row) => row.action, 
        sortable: true,
        cell: (row) => (
            <>
                {row.action}
            </>
        )
    },
    { 
        name: "Created At",
        selector: (row) => row.createdAt, 
        sortable: true,
        cell: (row) => (
            <>
                {row.createdAt}
            </>
        )
    },
    { 
        name: "Actions",
        ignoreRowClick: true,
        allowOverflow: true,
        cell: (row) => (
            <div className='d-flex'>
                <Actions row={row} module={MODULES.PERMISSIONS} />
            </div>
        )
    }
];

export const usersTableColumn = (currentPage, rowsPerPage) => [
    { 
        name: "Code",
        selector: (row) => row.employee_code, 
        sortable: true,
        cell: (row) => (
            <>
                {row.employee_code}
            </>
        ), 
        width: "110px"
    },
    { 
        name: "Role",
        selector: (row) => row.role_id.name, 
        sortable: true,
        cell: (row) => (
            <>
                {row.role_id.name}
            </>
        ),
        width: "200px"
    },
    { 
        name: "Name",
        selector: (row) => row.first_name, 
        sortable: true,
        cell: (row) => (
            <>
                <div className='user-info ms-1'>
                    <span className='d-block'>{row.first_name+' '+row.last_name}</span>
                    <small className='d-block text-end'>- {row.designation_id.name}</small>
                </div>
            </>
        ),
        width: "300px"
    },
    { 
        name: "Email",
        selector: (row) => row.company_email, 
        sortable: true,
        cell: (row) => (
            <>
                {row.company_email}
            </>
        ),
        width: "300px"
    },
    { 
        name: "Mobile Number",
        selector: (row) => row.mobile_number, 
        sortable: true,
        cell: (row) => (
            <>
                {row.mobile_number}
            </>
        ),
        width: "200px"
    },
    { 
        name: "City",
        selector: (row) => row.city, 
        sortable: true,
        cell: (row) => (
            <>
                {row.city}
            </>
        ),
        width: "200px"
    },
    { 
        name: "Status",
        selector: (row) => row.is_active, 
        sortable: true,
        cell: (row) => (
            <>
                <Badge color={row.is_active?'success':'danger'} className='badge-sm' pill>
                    {row.is_active?'Active':'In-Active'}
                </Badge>
            </>
        ),
        width: "115px"
    },
    { 
        name: "Actions",
        ignoreRowClick: true,
        allowOverflow: true,
        cell: (row) => (
            <div className='d-flex'>
                <Actions row={row} module={MODULES.EMPLOYEE} />
            </div>
        )
    },
];


