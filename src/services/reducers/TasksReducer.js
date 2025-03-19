import { TASKS_LIST,TASKS_DELETE } from '../constants';

const initialState  = {
    total: 0,
    data : [],
}

const TasksReducer = (state = initialState, action) => {
    switch (action.type) {
        case TASKS_LIST:
            return {
                ...state,
                data: action.data.data,
                total: action.data.total
            };
        case TASKS_DELETE:
            return {
                ...state,
                data: state.data.filter((task) => task._id !== action.id),
                total: state.total - 1
            };
        default:
            return state;
    }
}

export default TasksReducer;


