import { TASKS_LIST,TASKS_DELETE,TASK_UPDATE_LOGGED_HOURS } from '../constants';

const initialState  = {
    total: 0,
    data : [],
}

const convertTimeToDecimal = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    const decimalMinutes = minutes / 60;

    return hours + decimalMinutes;
};

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
        case TASK_UPDATE_LOGGED_HOURS:
            const total = action.payload.logedHours + convertTimeToDecimal(action.payload.newHours);
            
            return {
                data: state.data.map(task => task._id === action.payload.taskId ? { 
                    ...task,
                    total_logged_hours: total
                }: task)
            };
        default:
            return state;
    }
}

export default TasksReducer;


