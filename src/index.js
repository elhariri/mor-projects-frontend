/** @format */

import React from "react"
import ReactDOM from "react-dom"

import { ApolloClient } from "apollo-client"
import { ApolloProvider } from "@apollo/react-hooks"
import { HttpLink } from "apollo-link-http"
import { ApolloLink, concat } from "apollo-link"
import { InMemoryCache } from "apollo-cache-inmemory"

import Cookies from "js-cookie"

import { BrowserRouter as Router } from "react-router-dom"

import App from "./App"
import * as serviceWorker from "./serviceWorker"

const httpLink = new HttpLink({
    uri: process.env.REACT_APP_BACKEND_URL + "/graphql",
})

const authMiddleware = new ApolloLink((operation, forward) => {
    // add the authorization to the headers
    operation.setContext(({ headers = {} }) => ({
        headers: {
            ...headers,
            authorization: !!JSON.parse(Cookies.get("user"))
                ? `Bearer ${JSON.parse(Cookies.get("user")).jwt}`
                : null,
        },
    }))

    return forward(operation)
})

const client = new ApolloClient({
    link: concat(authMiddleware, httpLink),
    cache: new InMemoryCache(),
})

/* const client = new ApolloClient({
    uri: "http://localhost:1337/graphql",
}) */

ReactDOM.render(
    <ApolloProvider client={client}>
        <Router>
            <App />
        </Router>
    </ApolloProvider>,
    document.getElementById("root")
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
