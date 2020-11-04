/** @format */

import React, { useState, useEffect, useCallback } from "react"
import Cookies from "js-cookie"

import Header from "./components/header"

import Programs from "./pages/Programs"
import Program from "./pages/Program"
import Projects from "./pages/Projects"
import Project from "./pages/Project"
import TodoList from "./pages/TodoList"
import Task from "./pages/Task"
import NotFound from "./pages/404"

import Auth from "./pages/Auth"

import { Switch, Route } from "react-router-dom"

import styles from "./styles/global.module.css"
import "./styles/layout.css"

const Layout = () => {
    const [authenticated, setAuth] = useState(!!Cookies.get("user"))

    const isAuth = useCallback(() => {
        !!Cookies.get("user") && setAuth(true)
    }, [])

    useEffect(() => {
        !authenticated && isAuth()
    }, [isAuth, authenticated])

    return !authenticated ? (
        <Auth setAuth={setAuth} />
    ) : (
            <div
                style={{ flex: 1 }}
                className={`${styles.rowFlex} ${styles.mainContainer}`}
            >
                <Header siteTitle="home" />
                <main className={styles.columnFlex} style={{ flex: 1 }}>
                    <div className={`${styles.rowFlex} ${styles.topBar}`}></div>
                    <Switch>
                        <Route path="/Programs/:id" component={Program} />
                        <Route path="/Programs" component={Programs} />
                        <Route path="/Projects/:id" component={Project} />
                        <Route path="/Projects" component={Projects} />
                        <Route path="/TodoList" component={TodoList} />
                        <Route path="/Tasks/:id" component={Task} />
                        <Route component={NotFound} />
                    </Switch>
                </main>
            </div>
        )
}

export default Layout
