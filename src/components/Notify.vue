<template>
    <div class="ui secondary  menu" data-garbage="true">
        <div class="item">
           <div class="ui inline" :class="loading?'loader active ':''"></div>
           {{notifyMsg}}
        </div>
         <div class="item" v-if="authenticated">
             积分:{{myScore}}
         </div>
        <div class="right menu" data-garbage="true">
             <div class="item" v-if="authenticated">
               <router-link :to="'/user/' + myId">个人中心</router-link>
              </div>
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

import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'notify',
  data(){
     return{
         txtQuery:''
         //score:0
      }
  },
  created(){
  // this.score= this.loadMyScore()
  // console.log(score)
  },
  
  computed: mapGetters([
      'loading',
      'notifyMsg',
      'myScore'
  ]),
  methods:{
    //...mapActions(['loadMyScore']),
    search(){
        this.$router.push({name:'query',query:{keys:this.txtQuery}})
      // console.log(this.myScore)
    }  
  }
}
</script>
