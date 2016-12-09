<template>

  <div class="comment" data-garbage="true">
    <a class="avatar">
       <img :src="this.user.photoURL | tansformAvatarURL">
    </a>
    <div class="content">
      <div class="metadata" data-garbage="true">
        {{ comment.by }}
        <span class="date"> {{ comment.time | timeAgo }} </span>
      </div>
      <span v-if="comment.kids && comment.kids.length">
        | <a class="expand" @click="open = !open">
          {{ (open ? '收缩 ' : '展开 ') +'--' +comment.kids.length+'条回复'}}
        </a>
      </span>
      <div class="text" v-html="comment.title">
      </div>
      <div class="actions" data-garbage="true">
        <i class="icon edit" v-show="curItemId==id"></i> 
        <a class="reply" @click="emitReplyFor(comment.id)">回复</a>
      </div>
      
        <div v-show="open">
          <div v-if="comment.kids" class="ui threaded comments" data-garbage="true">
             <comment v-for="id in comment.kids" :id="id" :curItemId="curItemId" :key="id"
             @ReplyFor="emitReplyFor"></comment>
          </div>
        </div>

     
    </div>
  </div>

</template>
<script>
import { mapActions} from 'vuex'
export default {
  name: 'comment',
  props: ['id','curItemId'],
  data () {
    return {
      open: true,
      user:{},
      comment:{}

  
    }
  },
  created(){
     //console.log('created')
     this.loadData()
   },
 
  methods: {
     ...mapActions(['loadItem','loadUser']),
      emitReplyFor(id) {
         this.$emit('ReplyFor',id) 
         //console.log('addComment',this.newTitle)
     },
     loadData () {
      let self=this
      this.loadItem(this.id).then(item=>{
         self.comment=item
         this.loadUser(item.uid).then(u=>{
            self.user=u
            //console.log(self.id,self.comment.title)
          })
       })
       
    }
  }
}
</script>