import axios from "axios"
import { useState, useEffect } from "react"

const useAuth = (code) => {
    const [accessToken, setAccessToken] = useState()
    const [refreshToken, setRefreshToken] = useState()
    const [expiresIn, setExpiresIn] = useState()

    useEffect(()=> {
        axios
            .post("http://139.59.12.138/login", {
                code,
            })
            .then(res => {
                setAccessToken(res.data.accessToken)
                setRefreshToken(res.data.refreshToken)
                setExpiresIn(res.data.expiresIn)
                console.log('Atoken from chook ',res.data.accessToken)
                window.history.pushState({}, null, "/")
            })
            .catch((err) => {
                // window.location = "/"
                console.log(err)
            })
    }, [])

    useEffect(() => {
        if(!accessToken || !expiresIn) return 
        const interval = setInterval(() => {
            axios
                .post("http://139.59.12.138/refresh", {refreshToken, })
                .then(res => {
                    setAccessToken(res.data.accessToken)
                    setExpiresIn(res.data.expiresIn)
                })
                .catch(() => {
                    window.location = "/"
                })
        }, (expiresIn - 60) * 1000)

        return () => clearInterval(interval)
    }, [refreshToken, expiresIn])

    return accessToken
}

export default useAuth