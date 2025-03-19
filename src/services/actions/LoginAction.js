import { LOGIN_REQUEST, LOGOUT_REQUEST, UPDATE_PROFILE } from '../constants'

export const login = (data) => {
    return {
        type: LOGIN_REQUEST,
        data,
    }
}

export const logout = () => {
    return {
        type: LOGOUT_REQUEST
    }
}

export const updateProfile = (data) => {
    return {
        type: UPDATE_PROFILE,
        data
    }
}


