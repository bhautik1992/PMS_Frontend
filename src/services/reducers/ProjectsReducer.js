import { PROJECTS_LIST, PROJECT_DELETE } from '../constants';

const initialState  = {
    projects:[],
    activeProjects:[],
    closedProjects:[],
    total:0,
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
        case PROJECT_DELETE:
            return {
                ...state,
                projects: state.projects.filter((project) => project._id !== action.id),
                activeProjects: (state.projects).filter((project) => project.status === 'active' && project._id !== action.id),
                closedProjects: (state.projects).filter((project) => project.status === 'closed' && project._id !== action.id),
                total: state.total - 1,
            }
        default:
            return state
    }
}

export default ProjectsReducer;


