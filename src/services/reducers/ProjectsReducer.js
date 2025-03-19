import { PROJECTS_LIST } from '../constants';

const initialState  = {
    projects:[],
    activeProjects:[],
    closedProjects:[],
}

const ProjectsReducer = (state = initialState, action) => {
    switch(action.type){
        case PROJECTS_LIST:
            return {
                ...state,
                projects: action.data,
                activeProjects: (action.data).filter((project) => project.status === 'active'),
                closedProjects: (action.data).filter((project) => project.status === 'closed'),
            }
        default:
            return state
    }
}

export default ProjectsReducer;


