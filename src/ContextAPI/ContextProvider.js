import React from 'react'
import axios from 'axios'

export const AppContext = React.createContext()

export default class ContextProvider extends React.Component {
    state = {
        login: false,
        user: '',
        matchEvent: false,
        methods: {
            toggleMatchEvent: () => {
                this.setState(prevState => {
                    return {
                        matchEvent: !prevState.matchEvent
                    }
                })
            },
            checkForLogin: () => {
                // console.log('------------ Context checks for login')
                axios.get('/api/session/user').then(res => {
                    console.log('------------ res', res)
                    res.data.auth0_id &&
                    this.setState({ user: res.data, login: true })
                    })
            },
            login: () => {
                // console.log('------------ User logs in')
                const redirectUri = encodeURIComponent(`${window.location.origin}/auth/callback?prevPath=${window.location.pathname}`)
            
                window.location = `https://${process.env.REACT_APP_AUTH0_DOMAIN}/authorize?client_id=${process.env.REACT_APP_AUTH0_CLIENT_ID}&scope=openid%20profile%20email&redirect_uri=${redirectUri}&response_type=code`
            },
            logout: () => {
                axios.post('/api/session/user').then(res => {
                    // console.log('------------ res', res)
                    this.setState((prevState) => {
                        return {
                            login: !prevState.login,
                            user: ''
                        }
                    })
                    window.location = '/'
                })
            }
        }
    }

    render() {
        return(
            <AppContext.Provider value={this.state}>
                {this.props.children}
            </AppContext.Provider>
        )
    }
}