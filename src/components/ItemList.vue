<template>
	<div class="ui segment">

				<div class="ui three doubling cards" :key="displayedPage" v-if="displayedPage > 0">
         
					<book-card v-for="item in books" :key="item.id" :item="item">
					</book-card> 
          

				</div>

	
    <!--
		<div class="ui labeled icon button">
			<i class="left arrow icon"></i>
			<router-link v-if="page > 1" :to="'/' + type + '/' + (page - 1)">上页</router-link>
			<a v-else class="disabled">上页</a>
		</div>
		<span>{{ page }}/{{ maxPage }}</span>
		<div class="ui right labeled icon button">
			<i class="right arrow icon"></i>
			<router-link v-if="hasMore" :to="'/' + type + '/' + (page + 1)">更多</router-link>
			<a v-else class="disabled">更多</a>
		</div>
-->
	</div>

</template>

<script>
import { mapActions,mapGetters } from 'vuex'
import API from '../api'

import BookCard from './BookCard.vue'

export default {
  name: 'item-list',
  components: {
    BookCard
  },
  props: {
    type: String
  },
  wilddog: {
    news: API.api.child('new-books').orderByKey().limitToLast(50),
    tops: API.api.child('top-books').orderByValue().limitToLast(50)
  },

  data () {
    //const isInitialRender = !this.$root._isMounted
    return {
      transition: 'slide-left',
      itemsPerPage:3,
      displayedPage:  1,
      books:[],
    }
  },
  computed: {
   // ...mapGetters(['itemsPerPage','lists']),
  //  ...mapGetters({'displayedItems':'activeItems'}),
    page () {
      return Number(this.$route.params.page) || 1
    },
    maxPage () {
       return Math.ceil(this.books.length / this.itemsPerPage)
    },
    hasMore () {
      return this.page < this.maxPage
    },
    ids(){
       let ds=[]
       let data=this[this.type+'s'].reverse()
       for(let i=0;i<data.length;i++)
         ds.push(data[i]['.key'])
         console.log(ds)
        return ds
    }
 
  },
  watch:{
    ids:'loadBooks'
  },

  created(){
    //this.loadBooks()
  },

  methods: {
    ...mapActions(['loadItems']),
    async loadBooks(){
      this.books=await this.loadItems(this.ids)
    }
  }
}
</script>