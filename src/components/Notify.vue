<template>
    <div class="ui secondary  menu" data-garbage="true">
        <div class="item">
           <div class="ui inline" :class="loading?'loader active ':''"></div>
           {{notify}}
        </div>
        <div class="right menu" data-garbage="true">
            <div class="item">
              <div class="ui icon input">
                <input type="text" v-model="txtQuery" placeholder="查找..." @keyup.13="search()">
                <i class="search link icon" @click="search()"></i>
              </div>
            </div>
        </div>    

    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'notify',
  data(){
     return{
         txtQuery:''
     }
  },
  computed: mapGetters({
      loading: 'loading',
      notify: 'notifyMsg'
  }),
  methods:{
    search(){
        this.$router.push({name:'query',query:{keys:this.txtQuery}})
       // console.log(this.txtQuery)
    }  
  }
}
</script>
