<template>
	<div id='iteminfo'>
		<div class="ui top attached tabular menu" data-garbage="true">
			<a class="item active" data-tab="data">{{item.parent==0?'图书信息':'评论信息'}}</a>
			<a class="item" data-tab="images">图片浏览</a>
		</div>
		<div class="ui bottom attached tab segment active" data-tab="data">

			<div class="ui floating green message">
				<p>状态：{{state.state}}</p>
				<p  v-if="state.state!='可借'">===请求者：{{state.requester}}[{{state.requesterPhone}}]--{{state.time | timeAgo}}===</p>
			    <button v-if="authenticated&&state.state=='可借'" class="ui primary button" @click="requestBook()">申请借阅</button>
			</div>
			<div v-show="itsMe(item.uid)">
				
			    <button v-if="state.state==='申请'" @click="changeBookState('借出')" class="ui grey button">已经借出</button>
				<button class="ui green button" @click="changeBookState('可借')">可借借阅</button>
				<div class="ui  divider"></div>
				<div class="ui blue button" id="editbook">修改图书</div>
				<item-edit :itemId="Number($route.params.id)" :type="'book'"></item-edit>
			
			</div>
			<div>
				<h2>{{ item.title }}</h2>
				<p class="meta">
					{{ item.by }} 发表于 {{ item.time | timeAgo }}
				</p>
				<div class="extra content" v-html="item.text"></div>
            </div>

			<p class="ui dividing header">
				{{ keys.length>0 ? keys.length + '条回复' : '目前还未有回复.'}}
			</p>
			<div v-if="keys" class="ui threaded comments" data-garbage="true">
				<comment v-for="cid in keys" :id="cid" :curItemId="curItemId" :key="cid" @ReplyFor="updateReplyId"></comment>
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
			<div  v-for="img in images">
				<img :src="img | tansformImageURL" class="ui medium image">
				<div class="ui  divider"></div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import {set} from 'vue'
import {msgBus} from '../store'
import {ObjIntPropKeys2Array} from '../util'
import Comment from '../components/Comment.vue'
import ItemEdit from '../components/ItemEdit.vue'

export default {
  name: 'item-info',
  components: { Comment,ItemEdit },
  data(){
	 //let item= await this.loadItem(this.$route.params.id)
    return {
      item:{},
	  state:{},
      newTitle:'',
      newText:'',
	  curItemId:this.$route.params.id
    }
  },
  computed:{
	...mapGetters(['authenticated','myId']),
	keys(){
	   return ObjIntPropKeys2Array(this.item.kids)
	},
    images(){  
       let imgs=this.item.images||'empty.png'//'dog-1.jpg dog-2.jpg dog-3.jpg dog-0.jpg'
	   let ds=imgs.split(' ')
       return ds
    }
  },
  created(){
    
	this.loadData()
	let self=this
	msgBus.$on('ItemUpdated',self.reload) 
   },
   mounted() {
  
    $('.tabular.menu .item').tab()
    $('.myitem.modal')
	    .modal('attach events', '#editbook', 'show')
	
	//
  },
  destroyed(){
	let self=this
    msgBus.$off('ItemUpdated',self.reload) 
  },

   methods:{
     ...mapActions(['loadItem','loadUser','addItem','loadBookState','updateBookState']),
    async requestBook(){
		let requesterId=this.myId
		let ownerId=this.item.uid
		let bookId=this.item.id
	    let rt=await this.updateBookState({bookId,ownerId,requesterId,wantState:'申请'})
        if (rt.ok){
			this.loadData()
		}
	},
	async changeBookState(want){
		this.state.wantState=want
		let rt=await this.updateBookState(this.state)
		if (rt.ok)
		   this.loadData()
	   
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
    reload(book){
		console.log('ItemUpdated',book)
        this.loadData()

	},
	loadData () {
	    let itemId=this.$route.params.id
		let self=this

		this.loadItem(itemId).then(item=>{
           self.item=item
		   self.loadBookState({ownerId:item.uid,bookId:item.id}).then(state=>{
              self.state=state
			  set(self.state,'bookId',item.id)
			  set(self.state,'ownerId',item.uid)
			  if (!self.state.requesterId){
			     set(self.state,'requesterId',self.myId)
		      }
			  self.loadUser(state.requesterId).then(u=>{
				 	set(self.state,'requester',u.displayName)
					set(self.state,'requesterPhone',u.phone)
			  })
		    })
		 })
     }
	
	
  }
 
}
/*
  
async loadData () {
	    let itemId=this.$route.params.id
		this.item= await this.loadItem(itemId)
		this.state=await this.loadBookState({ownerId:this.item.uid,bookId:this.item.id})
		
		if (!this.state.requesterId){
			 set(this.state,'requesterId',this.myId)
		}
		let u=await this.loadUser(this.state.requesterId)
		
		set(this.state,'requester',u.displayName)
		set(this.state,'requesterPhone',u.phone)
		
     }
	*/
</script>