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
  components: {
    BookCard
  },
 

  data () {
    //const isInitialRender = !this.$root._isMounted
    return {
     // itemsPerPage:3,
    // keys: this.$route.query.keys||'',
      remote:[],
      books:[]

    }
  },
  created(){
     this.$bindAsArray('remote',API.api.child('new-books')
         .orderByKey())
    // this.loadBooks()
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
    'ids':'loadBooks',
    '$route':'loadBooks'
  },

 
  methods: {
    ...mapActions(['query']),
    loadBooks(){
      let self=this
      console.log('query Books',this.$route.query.keys)
      this.query({ids:this.ids,keys:this.$route.query.keys||''})
          .then(bs=>{
             self.books=bs
          })
    }
  }
}
</script>