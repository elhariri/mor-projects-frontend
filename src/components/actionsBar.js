import React from "react"

import globalStyles from "../styles/global.module.css"
import taskStyles from "./task.module.css"

const ActionsBar = ({ actions }) => {
    return (
        <div
            className={globalStyles.rowFlex}
            style={{
                background: "white",
                boxShadow: "0 5px 30px rgba(128, 128, 128, 0.1)",
                borderRadius: "5px",
                height: "fit-content",
            }}
        >
            {actions.map((el, i) => (
                <Action
                    key={i}
                    label={el.label}
                    click={el.action}
                    Icon={el.icon}
                />
            ))}
        </div>
    )
}

const Action = ({ click, label, Icon }) => {
    return (
        <button
            onClick={click}
            className={taskStyles.newLaneSection}
            style={{ background: "transparent" }}
        >
            <Icon style={{ width: "20px", marginRight: "10px" }} />
            <span style={{ lineHeight: "20px", fontWeight: "bold" }}>
                {label}
            </span>
        </button>
    )
}

export default ActionsBar
