<template>
  <div>
    <!--
    <div v-show="itsMe(book.uid)">
			       <div class="ui button"  id="editbook">修改图书</div>
		         <item-edit :mode="'edit'" :item="book" :type="'book'" ></item-edit>
		  </div>-->
     <div>
          <h2>{{ book.title }}</h2>
          <p class="meta">
            {{ book.by }} 发表于
            {{ book.time | timeAgo }} 
          </p>
           <div class="extra content">
              {{ book.text}}
            </div>
          
     </div>
       <p class="ui dividing header">
          {{ book.kids ? book.kids.length + '条回复' : '目前还未有回复.'}}
        </p>
    <div v-if="book.kids" class="ui comments" data-garbage="true">
      <comment v-for="cid in book.kids" :id="cid" :key="cid"></comment>
    </div>
    <!--
      <div class="ui comments" data-garbage="true">
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
import ItemEdit from '../components/ItemEdit.vue'


export default {
  name: 'book-view',
  components: { Comment,ItemEdit },
  data(){
    return {
      book:{}
    }
  },

   mounted() {
     
    $('.myitem.modal')
	  .modal('attach events', '#editbook', 'show')
	  .modal({
		  //closable:false,
		  //blurring: true,
		  onApprove : this.editBook
	  })
   },
   methods:{
     ...mapActions(['loadItem','loadUser']),
     editBook(){
       console.log('editBook')
     }
     ,loadData () {
       let self=this
       this.loadItem(this.$route.params.id).then(item=>{
         self.book=item
       })
     }
  },
  created(){
    this.loadData()
   }
 
}

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
</script>