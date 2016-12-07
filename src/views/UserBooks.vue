<template>
	<div class='userbooks'>
		<div v-if="itsMe">
			<div class="ui button"  id="addbook">新增图书</div>
		   <item-edit :mode="'add'" :item="{parent:0}" :type="'book'" ></item-edit>
		</div>
		<div class="ui divider"></div>
		<div class="ui top attached tabular menu" data-garbage="true">
			<a class="item active" data-tab="gird">图书列表</a>
			<a class="item" data-tab="card">封面浏览</a>
		</div>
		<div class="ui bottom attached tab segment active" data-tab="gird">
			<p class="ui text">
				Search <input name="query" v-model="searchQuery">
			</p>
			
			<my-grid :data="books" :columns="gridColumns" :filter-key="searchQuery" :callback="showBook" >
			</my-grid>
		</div>
		<div class="ui bottom attached tab segment" data-tab="card" data-garbage="true">
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
					<div class="side active">
						<img src="/static/images/stevie.jpg" class="ui medium image">
					</div>
					<div class="side">
						<img src="/static/images/steve.jpg" class="ui medium image">
					</div>
				</div>
			</div>


		</div>
	</div>

</template>
<script>
//
import { mapGetters ,mapActions} from 'vuex'
import {msgBus} from '../store'
import ItemEdit from '../components/ItemEdit.vue'
import MyGrid from '../components/MyGrid.vue'
export default {
 components: {ItemEdit,MyGrid},
 data() {
    return{
      searchQuery: '',
      gridColumns: [{
		  key:'title',
		  text:'书名',
	  },{
	   key:'keywords',
	   text:'关键字'
	  }],
	  books:[]
      
   }
 },
/* computed:{
	 ...mapGetters(['myId']),
    itsMe(){
      return (!!this.myId)&&this.$route.params.uid==this.myId
    },
 },*/
 
 methods:{...mapActions(['loadItemsByUser']),
 showBook(id){
   this.$router.push({name:'book',params:{id}})
 },
  async getBooks(){
		 let uid=this.$route.params.uid
		 this.books=await this.loadItemsByUser({uid,type:'book'})

	 }, 
	
	addBook(){
		 console.log('addBook')
		 window.alert('OK')
     //.modal('show')//.modal('setting', ) 

   },
   left(){
      $('.shape').shape('flip left')
   },
   right(){
      $('.shape').shape('flip right')
   }
 },
 
 watch: {
    // 如果路由有变化，会再次执行该方法
    '$route': 'getBooks'
  },

created(){
		msgBus.$on('addItem',(book)=>{
       if (this.$route.params.uid==book.uid)
			    this.getBooks()
		}) 
},
 mounted() {
    $('.ui.accordion').accordion()
    $('.tabular.menu .item').tab()
    $('.ui.shape').shape()
	this.getBooks()
	$('.myitem.modal')
	  .modal('attach events', '#addbook', 'show')
	  .modal({
		  //closable:false,
		  //blurring: true,
		  onApprove : this.addBook
	  })
 }
 
}
  
</script>