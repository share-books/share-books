<template>

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
          {{ (open ? '收缩 ' : '展开 ') + comment.kids.length+条回复
        </a>
      </span>
      <div class="text" v-html="comment.title">
      </div>
      <div class="actions" data-garbage="true">
        <a class="reply">回复</a>
      </div>
      
        <div v-show="open">
          <comment v-for="id in comment.kids" :id="id"></comment>
        </div>
    </div>
  </div>

</template>
<script>
import { mapActions} from 'vuex'
export default {
  name: 'comment',
  props: ['id'],
  data () {
    return {
      open: true,
      comment:{}
    }
  },
  created(){
     console.log('created')
     this.loadData()
   },
     mounted() {
        console.log('mounted')
     },
  methods: {
     ...mapActions(['loadItem']),
   
    loadData () {
      let self=this
       this.loadItem(this.id).then(item=>{
         self.comment=item
         console.log(self.id,self.comment.title)
       })
    }
  }
}
</script>