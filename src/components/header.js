/** @format */

//import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"

import { NavLink } from "react-router-dom"

import logo from "../images/square-logo_512x512.png"

import Tippy from "@tippyjs/react"
import "tippy.js/dist/tippy.css"

import * as NavBarIcons from "./icons/navbar"

import styles from "../styles/global.module.css"
import headerStyles from "../styles/header.module.css"

const Header = () => {
    return (
        <header className={`${headerStyles.header} ${styles.columnFlex}`}>
            <img
                alt="logo"
                src={logo}
                style={{ width: "30px", margin: "40px auto" }}
            />
            <div
                className={`${headerStyles.navbarContainer} ${styles.columnFlex}`}
            >
                <NavbarElement
                    Icon={NavBarIcons.Home}
                    to="/Home"
                    title="Home"
                />
                <NavbarElement
                    Icon={NavBarIcons.Tasks}
                    to="/TodoList"
                    title="Todo list"
                />
                <NavbarElement
                    Icon={NavBarIcons.Projects}
                    to="/Projects"
                    title="Projects"
                />
                <NavbarElement
                    Icon={NavBarIcons.Programs}
                    to="/Programs"
                    title="Programs"
                />
                <NavbarElement
                    Icon={NavBarIcons.Plan}
                    to="/Plan"
                    title="Plan"
                />
                <NavbarElement
                    Icon={NavBarIcons.Calendar}
                    to="/Calendar"
                    title="Calendar"
                />
            </div>
            <NavBarIcons.Exit
                style={{
                    fill: "white",
                    width: "22px",
                    margin: "auto auto 40px auto",
                }}
            />
        </header>
    )
}

Header.propTypes = {
    siteTitle: PropTypes.string,
}

Header.defaultProps = {
    siteTitle: ``,
}

const NavbarElement = ({ Icon, title, to }) => {
    return (
        <Tippy content={title} placement="right" className="tool-tip">
            <NavLink
                to={to}
                className={`${headerStyles.navbarElement} ${headerStyles.navbarIcon} ${styles.rowFlex}`}
                activeClassName={headerStyles.activeNavbarIcon}
            >
                <Icon style={{ width: "22px", margin: "auto" }} />
            </NavLink>
        </Tippy>
    )
}

export default Header
