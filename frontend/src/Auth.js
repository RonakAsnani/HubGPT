import { useLocation,Navigate } from "react-router-dom"

export const setToken = (token)=>{

    localStorage.setItem('DPAHub', token)// make up your own token
}

export const fetchToken = (token)=>{
    return localStorage.getItem('DPAHub')
}

export function RequireToken({children}){

    let auth = fetchToken()
    let location = useLocation()

    if(!auth){
        // alert("Please login first!")
        return <Navigate to='/login' state ={{from : location}}/>;
    }

    return children;
}

export function IsToken({children}){

    let auth = fetchToken()
    let location = useLocation()

    if(auth){
        // alert("Please login first!")
        return <Navigate to='/' state ={{from : location}}/>;
    }

    return children;
}

export function checkToken({children}){
    let auth = fetchToken()
    // let location = useLocation()
    if(auth){
        return true
    }
    return false;
}