import React, { useState } from "react"

import { FlatMenu } from "./icons/utils"

import globalStyles from "../styles/global.module.css"
import filterStyles from "../styles/filter.module.css"

const testfilter = [
  {
    id: "1",
    name: "bob",
  },
  {
    id: "2",
    name: "jack",
  },
  {
    id: "3",
    name: "catman",
  },
  {
    id: "4",
    name: "essaouira",
  },
]

export default ({ filters = testfilter, style = {} }) => {
  const [actifFilter, setActifFilter] = useState(filters[0].id)

  return (
    <div
      style={{ alignItems: "center", ...style }}
      className={globalStyles.rowFlex}
    >
      {filters.slice(0, 3).map((el, index) => {
        return (
          <button
            key={index}
            onClick={() => setActifFilter(el.id)}
            style={{ marginRight: "30px" }}
            className={`${filterStyles.filter} ${
              el.id === actifFilter ? filterStyles.activeFilter : ""
            }`}
          >
            {el.name}
          </button>
        )
      })}
      <FlatMenu
        style={{ width: "20px", margin: "auto 0 auto auto" }}
        className={globalStyles.menuIcon}
      />
    </div>
  )
}
