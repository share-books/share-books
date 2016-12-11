<template>
  <div class="event">
    <div class="label">
      <img :src="user&&user.photoURL||'' | tansformAvatarURL">
    </div>
    <div class="content">
      <div class="summary">
        <router-link :to="{name:'user',params:{ uid: record.uid }}">
          {{user&&user.displayName}}
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
          user:{},
          item:{}
      }
  },
  props: {
    record: Object
  },
  async created(){
      this.user=await this.loadUser(this.record.uid)
      this.item=await this.loadItem(this.record.id)
  },
 
  
  methods:mapActions(['loadItem','loadUser'])
 

}
</script>