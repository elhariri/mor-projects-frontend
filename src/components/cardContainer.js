import React from "react"
import { Link } from "react-router-dom"

import Cookies from "js-cookie"
import chroma from "chroma-js"

import { Menu, convertDate } from "./utils"

import taskStyles from "./task.module.css"
import globalStyles from "../styles/global.module.css"

export default ({ data, style, menuOptions }) => {
    const userId = JSON.parse(Cookies.get("user")).id.toString()
    const typeStyle =
        userId === data.admin.id
            ? {
                  background: chroma("#0052CC").alpha(0.15).css(),
                  color: "#0052CC",
              }
            : {
                  background: chroma("#FF8B00").alpha(0.15).css(),
                  color: "#FF8B00",
              }
    return (
        <Link
            to={`/Projects/${data.id}`}
            style={style}
            className={`${globalStyles.smallProjectCard} ${globalStyles.rowFlex}`}
        >
            <div
                className={globalStyles.columnFlex}
                style={{
                    margin: "5px",
                    flex: 1,
                }}
            >
                {!!data.cover && (
                    <div
                        className={`${taskStyles.taskImg} ${taskStyles.smallTaskImg}`}
                        style={{
                            backgroundImage:
                                "url(" +
                                process.env.REACT_APP_BACKEND_URL +
                                data.cover.url +
                                ")",
                            backgroundSize: "cover",
                        }}
                    ></div>
                )}
                <div
                    style={{
                        justifyContent: "space-between",
                        marginTop: "10px",
                    }}
                    className={`${globalStyles.rowFlex} `}
                >
                    <h1
                        style={{
                            fontStyle: "normal",
                            fontWeight: "700",
                            fontSize: "18px",
                            margin: "0 0 auto 0",
                            padding: "0",
                            color: "var(--dark-font)",
                        }}
                    >
                        {data.title}
                        <span
                            style={{
                                fontSize: "16px",
                                fontWeight: "500",
                                padding: "5px",
                                borderRadius: "5px",
                                marginLeft: "5px",
                                ...typeStyle,
                            }}
                        >
                            {userId === data.admin.id ? "admin" : "guest"}
                        </span>
                    </h1>
                    <Menu menuOptions={menuOptions} />
                </div>
                {!!data.description && <p>{data.description}</p>}
                {!!data.end_date && (
                    <p
                        style={{
                            margin: "5px 0 0 0",
                            padding: "0",
                        }}
                    >
                        {convertDate(data.end_date)}
                    </p>
                )}
            </div>
        </Link>
    )
}
