import React from "react"

import chroma from "chroma-js"

import { Menu } from "../utils"

export default ({ title, color, onDelete, ...props }) => {
    const menuOptions = [
        {
            name: "delete",
            handler: onDelete,
        },
    ]
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                marginRight: "10px",
            }}
        >
            <div
                style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    padding: "7px 7px",
                    borderRadius: "5px",
                    ...(!!color
                        ? {
                              color: color,
                              backgroundColor: chroma(color).alpha(0.1).css(),
                          }
                        : {}),
                }}
            >
                {title}
            </div>
            <Menu menuOptions={menuOptions} />
        </div>
    )
}
