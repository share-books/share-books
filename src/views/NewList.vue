<template>
  <div class="ui segment" data-garbage="true">

    <div class="ui three doubling cards">
     
        <book-card v-for="item in books" :key="item.id" :item="item">
        </book-card>
      

    </div>

  </div>

</template>

<script>
import { mapActions,mapGetters } from 'vuex'
import API from '../api'
import BookCard from '../components/BookCard.vue'

export default {
  name: 'new-list',
  components: {
    BookCard
  },
  wilddog: {
    'remote': API.api.child('new-books').orderByKey().limitToLast(50)

  },

  data () {
    //const isInitialRender = !this.$root._isMounted
    return {
     // itemsPerPage:3,
     // displayedPage:  1,
      books:[]

    }
  },
  computed: {
    ids(){
       let ds=[]
       let data=this.remote.reverse()
       for(let i=0;i<data.length;i++)
          ds.push(data[i]['.key'])
       return ds
    }
 
  },
  watch:{
    'ids':'loadBooks'
  },

 
  methods: {
    ...mapActions(['loadItems']),
    loadBooks(ids){
      let self=this
      console.log('loaded new Books')
      this.loadItems(ids).then(bs=>{
         self.books=bs
       })
    }
  }
}
</script>