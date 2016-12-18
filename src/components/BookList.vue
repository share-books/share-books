<template>
  <div class="ui segment" data-garbage="true">
<!--    
        <div class="ui left floated pagination menu" data-garbage="true">
              <a class="icon item">
                <i class="step backward icon"></i>
              </a>
              <a class="icon item">
                <i class="left chevron icon"></i>
              </a>
              <a class="icon item">
                <i class="right chevron icon"></i>
              </a>
              <a class="icon item">
                <i class="step backward icon"></i>
              </a>
       
        </div>
-->
    
 
        <div class="ui three doubling cards">
            <book-card v-for="item in books" :key="item.id" :item="item">
            </book-card>
        </div>

  </div>

</template>

<script>
import { mapActions,mapGetters } from 'vuex'
import appCfg from '../../config/app'
import API from '../api'
import BookCard from './BookCard.vue'

export default {
  name: 'book-list',
  components: {
    BookCard
  },
 /* wilddog: {
    'remote': API.api.child('top-books').orderByValue().limitToLast(50)
  },*/
 props: {
    type: String
  },
  data () {
    return {
      books:[],
      remote:[]
    }
  },
  created(){
    if ('top'==this.type)
       this.$bindAsArray('remote', API.api.child('top-books')
           .orderByValue().limitToLast(appCfg.MAX_LIST))
    else
       this.$bindAsArray('remote',API.api.child('new-books')
           .orderByKey().limitToLast(appCfg.MAX_LIST))
  },
  computed: {
    ids(){
       let ds=[]
       let rs=this.remote||[]
       let data=rs.reverse()
       for(let i=0;i<data.length;i++)
          ds.push(data[i]['.key'])
       return ds
    }
 
  },
  watch:{
    'remote':'loadBooks'
  },

 
  methods: {
    ...mapActions(['loadItems']),
    loadBooks(){
      let self=this
      console.log('loaded Books',this.type)
      this.loadItems(this.ids).then(bs=>{
             self.books=bs
       })

    }
  }
}
</script>