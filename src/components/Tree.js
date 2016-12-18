import { interpolateViridis } from 'd3-scale'

Math.deg = radians => {
  return radians * (180 / Math.PI)
}

const memo = {}

const key = ({ w, heightFactor, lean }) => {
  return [w, heightFactor, lean].join('-')
}

const memoizedCalc = args => {
  const memoKey = key(args)

  if (memo[memoKey]) {
    return memo[memoKey]
  } else {
    const { w, heightFactor, lean } = args
    const trigH = heightFactor * w

    const result = {
      nextRight: Math.sqrt(trigH ** 2 + (w * (0.5 + lean)) ** 2),
      nextLeft: Math.sqrt(trigH ** 2 + (w * (0.5 - lean)) ** 2),
      A: Math.deg(Math.atan(trigH / ((0.5 - lean) * w))),
      B: Math.deg(Math.atan(trigH / ((0.5 + lean) * w)))
    }

    memo[memoKey] = result
    return result
  }
}

const Tree = {
  functional: true,
  render (h, ctx) {
    const { w, x, y, heightFactor, lean, left, right, lvl, maxlvl } = ctx.data.attrs
    if (lvl >= maxlvl || w < 1) {
      return null
    }

    const { nextRight, nextLeft, A, B } = memoizedCalc({
      w: w,
      heightFactor: heightFactor,
      lean: lean
    })

    let rotate = ''

    if (left) {
      rotate = `rotate(${-A} 0 ${w})`
    } else if (right) {
      rotate = `rotate(${B} ${w} ${w})`
    }

    return (
      <g transform={`translate(${x} ${y}) ${rotate}`}>
        <rect width={w} height={w}
              x={0} y={0}
              style={{fill: interpolateViridis(lvl / maxlvl)}} />

        <Tree w={nextLeft}
                    x={0} y={-nextLeft}
                    lvl={lvl + 1} maxlvl={maxlvl}
                    heightFactor={heightFactor}
                    lean={lean}
                    left />

        <Tree w={nextRight}
                    x={w - nextRight} y={-nextRight}
                    lvl={lvl + 1} maxlvl={maxlvl}
                    heightFactor={heightFactor}
                    lean={lean}
                    right />

      </g>
    )
  }
}

export default Tree
