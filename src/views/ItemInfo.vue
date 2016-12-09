<template>
	<div id='iteminfo'>
		<div class="ui top attached tabular menu" data-garbage="true">
			<a class="item active" data-tab="data">图书信息</a>
			<a class="item" data-tab="images">图片浏览</a>
		</div>
		<div class="ui bottom attached tab segment active" data-tab="data">
			<div v-show="itsMe(book.uid)">
				<div class="ui button" id="editbook">修改图书</div>
				<item-edit :mode="'edit'" :item="book" :type="'book'"></item-edit>
			</div>
			<div>
				<h2>{{ book.title }}</h2>
				<p class="meta">
					{{ book.by }} 发表于 {{ book.time | timeAgo }}
				</p>
				<div class="extra content">
					{{ book.text}}
				</div>

			</div>
			<p class="ui dividing header">
				{{ book.kids ? book.kids.length + '条回复' : '目前还未有回复.'}}
			</p>
			<div v-if="book.kids" class="ui threaded comments" data-garbage="true">
				<comment v-for="cid in book.kids" :id="cid" :curItemId="curItemId" :key="cid" @ReplyFor="updateReplyId"></comment>
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
  
					<div class="side" v-for="img in images()">
						<img :src="img | tansformImageURL" class="ui medium image">
					</div>
			
				</div>
			</div>


		</div>

	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Comment from '../components/Comment.vue'
import ItemEdit from '../components/ItemEdit.vue'


export default {
  name: 'item-info',
  components: { Comment,ItemEdit },
  data(){
    return {
      book:{},
      newTitle:'',
      newText:'',
      curItemId:0
    }
  },
  computed:mapGetters(['authenticated']),

   mounted() {
     /*
    $('.myitem.modal')
	  .modal('attach events', '#editbook', 'show')
	  .modal({
		  //closable:false,
		  //blurring: true,
		  onApprove : this.editBook
	  })*/
    $('.tabular.menu .item').tab()
    $('.ui.shape').shape()
   },
   methods:{
     ...mapActions(['loadItem','loadUser','addItem']),
       images(){

        let imgs=[]
        if (this.book.images) 
          imgs=this.book.images.split(' ')
        return imgs
    },
      left(){
      $('.shape').shape('flip left')
   },
   right(){
      $('.shape').shape('flip right')
   },
     updateReplyId(id){
        this.curItemId=id
        console.log(id)
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
         self.book=item
         self.curItemId=item.id
       })
     }
  },
  created(){
    this.loadData()
   }
 
}

   /*,fetchComments (item) {
      let self=this
     // console.log(item.id)
      if (item.kids) {
        return this.fetchItems( { ids: item.kids })
            .then( () => Promise.all(item.kids.map(id => {
               return self.fetchComments(self.items[id])
             })))
      }
    }*/
</script>