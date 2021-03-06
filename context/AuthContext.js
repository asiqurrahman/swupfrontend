import { createContext, useState, useEffect } from 'react'
import jwt_decode from "jwt-decode"
import { useRouter } from 'next/router'


const AuthContext = createContext()

export default AuthContext;

export const AuthProvider = ({children}) => {

    let [authTokens, setAuthTokens] = useState(null)
    let [user, setUser] = useState(null)
    let [loading, setLoading] = useState(false)
    let [failedlogin, setFailedlogin] = useState(false)
    let [locationset, setLocationset] = useState()
    let [submitted, setSubmitted] = useState()

    const router = useRouter()

    const userid = user?.user_id
    const token = authTokens?.refresh

    useEffect(() => {
            if(localStorage.getItem('authTokens')) {
                setAuthTokens(JSON.parse(localStorage.getItem('authTokens')))
                setUser(jwt_decode(localStorage.getItem('authTokens')))
            } else {
                setAuthTokens(null)
                setUser(null)
            } 
    }, [])

    useEffect(() => {
        setLocationset(JSON.parse(localStorage.getItem('location')))
    }, [])

    let loginUser = async (e) => {
        e.preventDefault();
        setSubmitted(true)
        let response = await fetch('https://asiqursswap.herokuapp.com/api/token/', {
        // let response = await fetch('http://127.0.0.1:8000/api/token/', {
            method:'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({'email':e.target.email.value, 'password':e.target.password.value})
        })
        let data = await response.json()

        if(response.status == 200) {
            setSubmitted(false)
            setAuthTokens(data)
            setUser(jwt_decode(data.access))
            localStorage.setItem('authTokens', JSON.stringify(data))
            localStorage.setItem('location', JSON.stringify(data.lat))
            router.push('/')
        } else {
            setSubmitted(false)
            setFailedlogin(true)
        }
    }

    let logoutUser = () => {
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem('authTokens')
        localStorage.removeItem('location')
        router.push('/login')
    }

    
    let updateToken = async () => {
        let response = await fetch('https://asiqursswap.herokuapp.com/api/token/refresh/', {
        // let response = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
            method:'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({'refresh': refresh})
        })
        let data = await response.json()

        if(response.status == 200 ) {
            setAuthTokens(data)
            setUser(jwt_decode(data.access))
            localStorage.setItem('authTokens', JSON.stringify(data))
        } else {
            logoutUser()
        }
        if(loading) {
            setLoading(false)
          }
    }


    useEffect(()=> {
        if(loading) {
            updateToken()
        }
        let fourMinutes = 1000 * 60 * 4

        let interval =  setInterval(()=> {
            if(authTokens){
                updateToken()
            }
        }, fourMinutes)
        return ()=> clearInterval(interval)

    }, [authTokens, loading])

    useEffect(async() => {
        const response = await fetch(`https://asiqursswap.herokuapp.com/api/user/${userid}/`)
        const data = await response.json()
        if(data.lat) {
            localStorage.setItem('location', true)
        } else {
            localStorage.setItem('location', false)
        }
    }, [userid])

    let contextData = {
        user:user,
        loginUser:loginUser,
        logoutUser:logoutUser,
        authTokens:authTokens,
        failedlogin:failedlogin,
        locationset:locationset,
        submitted:submitted,
    }

    return(
        <AuthContext.Provider value={contextData} >
            {loading ? null : children}
        </AuthContext.Provider>
    )
}
