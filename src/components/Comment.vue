<template>

  <div class="comment" data-garbage="true">
    <a class="avatar">
       <img :src="this.user.photoURL | tansformAvatarURL">
    </a>
    <div class="content">
      <div class="metadata" data-garbage="true">
        {{ user.displayName }} [{{ user.city }}]
        <span class="date"> {{ comment.time | timeAgo }} </span>
      </div>
      <span v-if="keys.length">
        | <a class="expand" @click="open = !open">
          {{ (open ? '收缩 ' : '展开 ') +'--' +keys.length+'条回复'}}
        </a>
      </span>
      <div class="text" v-html="comment.title">
      </div>
      <div class="extra content" v-html="comment.text">
			
				</div>
      <div class="actions" data-garbage="true">
        <i class="icon edit" v-show="curItemId==id"></i> 
        <a class="reply" @click="emitReplyFor(comment.id)">回复</a>
      </div>
      
        <div v-show="open">
          <div v-if="keys&&keys.length" class="ui threaded comments" data-garbage="true">
             <comment v-for="id in keys" :id="id" :curItemId="curItemId" :key="id"
             @ReplyFor="emitReplyFor"></comment>
          </div>
        </div>

     
    </div>
  </div>

</template>
<script>
import { mapActions} from 'vuex'

import {ObjIntPropKeys2Array} from '../util'

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
computed:{
  keys(){
	   let rt= ObjIntPropKeys2Array(this.comment.kids)
		// console.log(rt)
     return rt
	}
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