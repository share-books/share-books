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

					<item v-for="item in displayedItems" :key="item.id" :item="item">
					</item>

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
import {watchList} from '../api'
import Item from './Item.vue'

export default {
  name: 'item-list',
  components: {
    Item
  },
  props: {
    type: String
  },

  data () {
    //const isInitialRender = !this.$root._isMounted
    return {
      transition: 'slide-left',
      displayedPage:  1,
      unwatchList:null
    }
  },
  computed: {
    ...mapGetters(['itemsPerPage','lists']),
    ...mapGetters({'displayedItems':'activeItems'}),
    page () {
      return Number(this.$route.params.page) || 1
    },
    maxPage () {
       return Math.ceil(this.lists[this.type].length / this.itemsPerPage)
    },
    hasMore () {
      return this.page < this.maxPage
    }
  },

  beforeMount () {
    let self=this
    self.unwatchList = watchList(this.type,ids => {
        self.fetchListData({ type: self.type, ids })
       }
    )
  },

  beforeDestroy () {
   // if (!!this.unwatchList)
       this.unwatchList()
  },

  watch: {
    page (to, from) {
      this.loadItems(to, from)
    }
  },

  methods: {
    ...mapActions(['fetchListData']),
   addNewItem(){
        let u=curUser()
        if (!u) return
        let demo={
              "uid": u.uid,
              "by": u.displayName,
              "descendants": 0,
              "score": 0,
              "time": Date.now(),
              "title": "this is test",
              "type": "book"
            }
       // businessMgr.addItem(demo)
                
    },
 
    loadItems (to = this.page, from = -1) {
      //this.beginLoad()
      this.fetchListData({type: this.type})
      .then(() => {
        if (this.page < 0 || this.page > this.maxPage) {
          //this.$router.replace(`/${this.type}/1`)
          this.$router.replace(`/${this.type}/1`)
          //return
        }
        this.transition = to > from ? 'slide-left' : 'slide-right'
        this.displayedPage = to
       // this.displayedItems = this.activeItems
         console.log('loadItems:',this.displayedItems.length)
      })
    }
  }
}
</script>