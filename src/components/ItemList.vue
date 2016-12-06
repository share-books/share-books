<template>
	<div class="ui segment">

		<div>
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

			<transition :name="transition">
				<div class="ui three doubling cards" :key="displayedPage" v-if="displayedPage > 0">

					<book v-for="item in books" :key="item.id" :item="item">
					</book> 

				</div>
			</transition>
		</div>
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

	</div>

</template>

<script>
import { mapActions,mapGetters } from 'vuex'
import API from '../api'
//import {watchList} from '../api'
import Book from './Book.vue'

export default {
  name: 'item-list',
  components: {
    Book
  },
  props: {
    type: String
  },
  wilddog: {
    ids:{
      source: API.api.child('new-books').limitToLast(50),
      asObject: true
    }
  },

  data () {
    //const isInitialRender = !this.$root._isMounted
    return {
      transition: 'slide-left',
      itemsPerPage:3,
      displayedPage:  1,
      books:[]
     // key:''
      //unwatchList:null
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
    }
  },

  created () {
    //this.key=this.type+'-books'
//this.$bindAsArray('ids', API.api.child(this.key).limitToLast(50))
    /*self.unwatchList = watchList(this.type,ids => {
        self.fetchListData({ type: self.type, ids })
       }
    )*/
  },

  beforeDestroy () {
   // if (!!this.unwatchList)
   // this.unwatchList()
  },

  watch: {
    ids(data) {
      console.log(data)
      this.loadItems(data['.value']).then(books=>{
        //console.log(books.length)
        this.books=books
      })
    }
  },

  methods: mapActions(['loadItems'])
}
</script>