<template>
	<div id='iteminfo'>
		<div class="ui top attached tabular menu" data-garbage="true">
			<a class="item active" data-tab="data">{{item.parent>0?'图书信息':'评论信息'}}</a>
			<a class="item" data-tab="images">图片浏览</a>
		</div>
		<div class="ui bottom attached tab segment active" data-tab="data">
			<div v-show="itsMe(item.uid)">
				<div class="ui button" id="editbook">修改图书</div>
				<item-edit  :itemId="$route.params.id" :type="'book'"></item-edit>
			</div>
			<div>
				<h2>{{ item.title }}</h2>
				<p class="meta">
					{{ item.by }} 发表于 {{ item.time | timeAgo }}
				</p>
				<div class="extra content" v-html="item.text">

				</div>

			</div>
			<p class="ui dividing header">
				{{ item.kids ? item.kids.length + '条回复' : '目前还未有回复.'}}
			</p>
			<div v-if="item.kids" class="ui threaded comments" data-garbage="true">
				<comment v-for="cid in item.kids" :id="cid" :curItemId="curItemId" :key="cid" @ReplyFor="updateReplyId"></comment>
			</div>
			<form v-if="authenticated" class="ui reply form">
				<div class="field">
					<input type="text" placeholder="摘要..." v-model="newTitle">
				</div>
				<div class="field">
					<textarea v-model="newText"></textarea>
				</div>
				<div class="ui blue labeled  icon button">
					<i class="icon edit"></i>
					<div @click="addComment"> 回复</div>
				</div>

			</form>

		</div>
		<div class="ui bottom attached tab segment" data-tab="images" data-garbage="true">


			<div class="ui  divider"></div>

		     <div :id="'img-'+i"   v-for="(img,i) in images" >
						<img :src="img | tansformImageURL" class="ui medium image">
						<div class="ui  divider"></div>
			</div>

			


		</div>

	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import {msgBus} from '../store'
import Comment from '../components/Comment.vue'
import ItemEdit from '../components/ItemEdit.vue'

export default {
  name: 'item-info',
  components: { Comment,ItemEdit },
   data(){
	 //let item= await this.loadItem(this.$route.params.id)
    return {
      item:{},
	 
      newTitle:'',
      newText:'',
      curItemId:0
    }
  },
  computed:{
	...mapGetters(['authenticated']),
    images(){  
		//
       let imgs=this.item.images||'empty.png'//'dog-1.jpg dog-2.jpg dog-3.jpg dog-0.jpg'
	   let ds=imgs.split(' ')
       return ds
    }
  },
 created(){
    this.loadData()
	console.log('item id:',this.$route.params.id)
	msgBus.$on('ItemsChanged',d=>{
		
        this.loadData()
	 })
   },
   mounted() {
  
    $('.tabular.menu .item').tab()

    $('.myitem.modal')
	    .modal('attach events', '#editbook', 'show')


   },
   methods:{
     ...mapActions(['loadItem','loadUser','addItem']),

   updateReplyId(id){
        this.curItemId=id
        //console.log(id)
   },
   addComment(){
         this.addItem({
            title:this.newTitle,
            parent:this.curItemId,
            type:'',
            text:this.newText
        })
  
     },
    loadData () {
       let self=this
       this.loadItem(this.$route.params.id).then(item=>{
         self.item=item
         self.curItemId=item.id
		
		 //console.log('ItemsChanged',item.id)
		
       })
     }
  }
 
}
/*
  
   */
</script>