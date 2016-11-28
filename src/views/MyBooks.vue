<template>
    <div>
        <div class="ui accordion" >
            <div class="active title">
                <i class="dropdown icon"></i> 新增图书
            </div>
            <div class="active content">
                <add-book></add-book>
            </div>
        </div>
        <div class="ui divider"></div>
        <p class="ui text">
        Search <input name="query" v-model="searchQuery">
        </p>
      <my-grid
        :data="mybooks"
        :columns="gridColumns"
        :filter-key="searchQuery">
      </my-grid>
    </div>
</template>
<script>
import { mapGetters ,mapActions} from 'vuex'
import AddBook from '../components/AddBook.vue'
import MyGrid from '../components/MyGrid.vue'
export default {
 components: {AddBook,MyGrid},
data() {
    return{
      searchQuery: '',
      gridColumns: ['title', 'keywords'],
      
   }
 },
 methods:mapActions(['getMyBooks']),
 computed:mapGetters(['mybooks']),
 mounted() {
   $('.ui.accordion').accordion()
    this.getMyBooks()
 }
 
}

</script>