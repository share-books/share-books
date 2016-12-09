<template>
	<div id='iteminfo'>
		<div class="ui top attached tabular menu" data-garbage="true">
			<a class="item active" data-tab="data">图书信息</a>
			<a class="item" data-tab="images">图片浏览</a>
		</div>
		<div class="ui bottom attached tab segment active" data-tab="data">
			<div v-show="itsMe(item.uid)">
				<div class="ui button" id="editbook">修改图书</div>
				<item-edit :mode="'edit'" :item="item" :type="'book'"></item-edit>
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
			<div class="ui animated fade button" tabindex="0" @click="right">
				<div class="visible content">上一个</div>
				<div class="hidden content">
					<i class="left long arrow icon"></i>
				</div>
			</div>
			<div class="ui animated fade button" tabindex="0" @click="left">
				<div class="visible content">下一个</div>
				<div class="hidden content">
					<i class="right long arrow icon"></i>
				</div>
			</div>


			<div class="ui  divider"></div>

			<div class="square ui shape ">
				<div class="sides">
			     
					<div class="side" v-for="g in images" >
					 
					 <img :src="g | tansformImageURL" class="ui medium image">
					
					</div>

				</div>
			</div>


		</div>

	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
//import { tansformImageURL } from '../filters'
import Comment from '../components/Comment.vue'
import ItemEdit from '../components/ItemEdit.vue'
/*	<div class="side">
			<img src="/static/images/dog-1.jpg" class="ui medium image">
		</div>
		<div class="side">
			<img src="/static/images/dog-2.jpg" class="ui medium image">
		</div>
		<div class="side">
			<img src="/static/images/dog-3.jpg" class="ui medium image">
  	</div>
*/
//
export default {
  name: 'item-info',
  components: { Comment,ItemEdit },
  data(){
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
       let imgs=[]
       if (this.item.images) {
						console.log(this.item.images)
						imgs=this.item.images.split(' ')
				}
				console.log(imgs)
        return imgs
    }
	},

   mounted() {
  
    $('.tabular.menu .item').tab()
    $('.ui.shape').shape()
		$('.myitem.modal')
	    .modal('attach events', '#editbook', 'show')
   },
   methods:{
     ...mapActions(['loadItem','loadUser']),
     
      left(){
      $('.shape').shape('flip left')
   },
   right(){
      $('.shape').shape('flip right')
   },
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
       })
     }
  },
  created(){
    this.loadData()
   }
 
}

</script>