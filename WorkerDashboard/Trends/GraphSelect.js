import React from 'react'
import { css } from 'aphrodite/no-important'

import { graphSelectList } from './helpers'
import styles from './styles'

const GraphSelect = (props) => {
  const list = graphSelectList.map((category, i) => {
    return (
      <optgroup label={category.name} key={i}>
        {category.types.map((type, j) => {
          return (<option value={type.title} key={j}>{`${type.title}`}</option>)
        })}
      </optgroup>
    )
  })

  return (
    <div id={props.id}>
      <select
        defaultValue={props.defaultValue}
        onChange={(event) => props.handler(event)}
        className={css(styles.select)}
        style={{ borderBottom: `2px solid ${props.color}` }}
      >
        {list}
      </select>
    </div>
  )
}

export default GraphSelect
