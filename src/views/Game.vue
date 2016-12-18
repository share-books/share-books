<template>
    <div>
        <svg :width="svg.width" :height="svg.height" ref="svg">
            <Tree :w="baseW"
                        :h="baseW"
                        :heightFactor="heightFactor"
                        :lean="lean"
                        :x="svg.width / 2 - 40"
                        :y="svg.height - baseW"
                        :lvl="0"
                        :maxlvl="currentMax"/>
        </svg>
      </p>
  </div>

</template>

<script>
import { select as d3select, mouse as d3mouse } from 'd3-selection'
import { scaleLinear } from 'd3-scale'
import Tree from '../components/Tree.js'

function throttleWithRAF (fn) {
  let running = false
  return function () {
    if (running) return
    running = true
    window.requestAnimationFrame(() => {
      fn.apply(this, arguments)
      running = false
    })
  }
}

const realMax = 11

export default {
  name: 'game',

  components: { Tree },

  data () {
    return {
      svg: {
        width: 900,
        height: 600
      },

      currentMax: 0,
      baseW: 80,
      heightFactor: 0,
      lean: 0
    }
  },

  mounted () {//mousemove
    d3select(this.$refs.svg).on('mousemove', this.onMouseMove)
    d3select(this.$refs.svg).on('touchmove', this.onMouseMove)
    this.next()
  },

  methods: {
    next () {
      if (this.currentMax < realMax) {
        this.currentMax += 1
        setTimeout(this.next, 500)
      }
    },

    onMouseMove () {
      const [x, y] = d3mouse(this.$refs.svg)
      this.update(x, y)
    },

    update: throttleWithRAF(function (x, y) {
      const scaleFactor = scaleLinear()
        .domain([this.svg.height, 0])
        .range([0, 0.8])

      const scaleLean = scaleLinear()
        .domain([0, this.svg.width / 2, this.svg.width])
        .range([0.5, 0, -0.5])

      this.heightFactor = scaleFactor(y)
      this.lean = scaleLean(x)
    })
  }
}
</script>

