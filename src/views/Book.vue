<template>
  <div>
     <div>
          <h2>{{ item.title }}</h2>
          <p class="meta">
            {{ item.by }} 发表于
            {{ item.time | timeAgo }} 
          </p>
     </div>
       <p class="ui dividing header">
          {{ item.kids ? item.kids.length + '条回复' : '目前还未有回复.'}}
        </p>
    <div v-if="item.kids" class="ui comments">
      
         <comment v-for="cid in item.kids" :id="Number(cid)" :key="cid"></comment>
     </div>
    <!--
      <form class="ui reply form">
        <div class="field">
          <textarea ></textarea>
        </div>
        <div class="ui blue labeled submit icon button">
          <i class="icon edit"></i> 回复
        </div>
      </form>
  -->
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Comment from '../components/Comment.vue'



export default {
  name: 'book-view',
  components: { Comment },
  methods:{
    ...mapActions(['fetchItems'])
   /*,fetchComments (item) {
      let self=this
     // console.log(item.id)
      if (item.kids) {
        return this.fetchItems( { ids: item.kids })
            .then( () => Promise.all(item.kids.map(id => {
               return self.fetchComments(self.items[id])
             })))
      }
    }*/
  },
  computed: {
    ...mapGetters(['items']),
    item () {
      let item=this.items[this.$route.params.id]
      //console.log(item)
      return item
    }
  }
}
</script>