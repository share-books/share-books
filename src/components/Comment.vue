<template>
  <div class="ui  comments" data-garbage="true">
  <div class="comment" data-garbage="true">
    <a class="avatar">
      <img src="/static/images/av-0.jpg">
    </a>
    <div class="content">
   
      <div class="metadata" data-garbage="true">
        {{ comment.by }}
        <span class="date"> {{ comment.time | timeAgo }} </span>
      </div>
      <span v-if="comment.kids && comment.kids.length">
        | <a class="expand" @click="open = !open">
          {{ (open ? '收缩 ' : '展开 ') + pluralize(comment.kids.length) }}
        </a>
      </span>
      <div class="text" v-html="comment.title">
      </div>
      <div class="actions" data-garbage="true">
        <a class="reply">回复</a>
      </div>
      <div  v-show="open">
          <comment v-for="id in comment.kids" :id="Number(id)"></comment>
       </div>
    </div>
  </div>

  </div>
</template>

<script>
import { mapGetters ,mapActions} from 'vuex'
export default {
  name: 'comment',
  props: ['id'],
  data () {
    return {
      open: true
    }
  },
 
  computed: {
    ...mapGetters(['items']),
    comment () {
      return this.items[this.id]||{}
    }
  },
  beforeMount () {
    this.fetchItems({
      ids: [this.id]
    })
  },
  methods: {
     ...mapActions(['fetchItems']),
    pluralize (n) {
      return n + ('条回复 ')
    }
  }
}
</script>


