<template>
  <div class="event">
    <div class="label">
      <img :src="user.photoURL||'' | tansformAvatarURL">
    </div>
    <div class="content">
      <div class="summary">
        <router-link :to="{name:'user',params:{ uid: record.uid }}">
          {{user.displayName}}
        </router-link>
        {{record.event}}

        <router-link :to="{name:'item',params:{ id: record.id }}">
          {{item.title}}
        </router-link>

        <div class="date">
          {{item.time | timeAgo }}
        </div>
      </div>
   <!--   <div class="extra images">
        
      </div>-->
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  replace: true,
  name: 'feed',
  data(){
      return {
         item:{},
         user:{}
      }
  },
  props: {
    record: Object
  },
   created(){
     let self=this
     //console.log(this.record)
     this.loadUser(this.record.uid)
         .then(u=>{
            if(!u) 
               console.log('load user fail:',self.record.uid)
            self.user=u||{}
       
         })
     this.loadItem(this.record.id)
          .then(item=>{
            self.item=item
         })
  },
 
  
  methods:mapActions(['loadItem','loadUser'])
 

}
</script>