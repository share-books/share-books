<template>
 <div class="ui two column grid">
  <div class="column">
    <div class="ui segment">
      <img :src="staticRoot+'images/WX.png'" class="ui medium image"/>
    </div>
  </div>
  <div class="column">
    <div class="ui segment">
      <img :src="staticRoot+'images/ZFB.png'" class="ui medium image"/>
    </div>
  </div>
</div>
</template>
<script>
   import API from '../api'
   import appCfg from '../../config/app'
   import Feed from '../components/Feed.vue'
   export default {
     computed:{
    
     }
   }
   
</script>
