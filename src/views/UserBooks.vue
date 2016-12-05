<template>
	<div class='example'>
		<div class="ui accordion">
			<div class="active title">
				<i class="dropdown icon"></i> 新增图书
			</div>
			<div class="active content">
				<add-book></add-book>
			</div>
		</div>
		<div class="ui divider"></div>
		<div class="ui top attached tabular menu" data-garbage="true">
			<a class="item active" data-tab="gird">信息表格</a>
			<a class="item" data-tab="card">封面浏览</a>
		</div>
		<div class="ui bottom attached tab segment active" data-tab="gird">
			<p class="ui text">
				Search <input name="query" v-model="searchQuery">
			</p>
			<my-grid :data="books" :columns="gridColumns" :filter-key="searchQuery">
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
			<div class="demo square ui shape ">
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
import { mapGetters ,mapActions} from 'vuex'
import {msgBus} from '../store'
import AddBook from '../components/AddBook.vue'
import MyGrid from '../components/MyGrid.vue'
export default {
 components: {AddBook,MyGrid},
 data() {
    return{
      searchQuery: '',
      gridColumns: ['title', 'keywords'],
			books:[]
      
   }
 },
 methods:{...mapActions(['loadItemsByUser']),
  async getBooks(){
		 let uid=this.$route.params.uid
		 this.books=await this.loadItemsByUser({uid,type:'book'})

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
		msgBus.$on('addNewBook',(book)=>{
       if (this.$route.params.uid==book.uid)
			    this.getBooks()
		}) 
},
 mounted() {
    $('.ui.accordion').accordion()
    $('.tabular.menu .item').tab()
    $('.ui.shape').shape()
		this.getBooks()
	
 }
 
}
  
</script>