<template>
  <div class="ui  comments" data-garbage="true">
  <div class="comment" data-garbage="true">
    <a class="avatar">
      <img src="../assets/av-0.jpg">
    </a>
    <div class="content">
      <router-link class="author" :to="'/user/' + comment.uid">{{ comment.by }}</router-link>
      <div class="metadata" data-garbage="true">
        <span class="date"> {{ comment.time | timeAgo }} ago</span>
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
          <comment v-for="id in comment.kids" :id="id"></comment>
       </div>
    </div>
  </div>

  </div>
</template>

<script>
export default {
  name: 'comment',
  props: ['id'],
  data () {
    return {
      open: true
    }
  },
  computed: {
    comment () {
      return this.$store.state.items[this.id]||{}
    }
  },
  beforeMount () {
    this.$store.dispatch('FETCH_ITEMS', {
      ids: [this.id]
    })
  },
  methods: {
    pluralize (n) {
      return n + ('条回复 ')
    }
  }
}
</script>


