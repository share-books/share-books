<template>
	<div class='userbooks'>
		<div v-if="itsMe($route.params.uid)">
			<div class="ui button" id="addbook">新增图书</div>
			<item-edit  :itemId="0" :type="'book'" ></item-edit>
		</div>
		<div class="ui divider"></div>


		<p class="ui text">
			查找 <input name="query" v-model="searchQuery">
		</p>

		<my-grid :data="books" :columns="gridColumns" :filter-key="searchQuery" :callback="showBook">
		</my-grid>


	</div>

</template>
<script>
//
import {mapActions} from 'vuex'
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
watch: {
    // 如果路由有变化，会再次执行该方法
    '$route': 'getBooks'
 },
 methods:{
	...mapActions(['loadItemsByUser']),
	showBook(id){
	  this.$router.push({name:'item',params:{id}})
	},
	reload(book){
		console.log('ItemAdded',book)
		let self=this
        if (self.$route.params.uid==book.uid)
		   self.getBooks()

	},
   async getBooks(){
		 let uid=this.$route.params.uid
		 this.books=await this.loadItemsByUser({uid,type:'book'})
   }
},
 
 destroyed(){
	 let self=this
    msgBus.$off('ItemAdded',self.reload) 
 },

created(){
	  let self=this
	  this.getBooks()
      msgBus.$on('ItemAdded',self.reload) 
},
 mounted() {
    $('.ui.accordion').accordion()
	if(this.itsMe(this.$route.params.uid)){
		$('.myitem.modal')
	     .modal('attach events', '#addbook', 'show')

	}
  
     
	
	 
 }
}
</script>