<template>
    <div>
       <div class="ui accordion" v-if="itsMe($route.params.uid)">
          <div class="active title">
            <i class="dropdown icon"></i>
            个人资料
          </div>
          <div class="active content">
            <user-edit></user-edit>
          </div>
      
      </div>
      <router-view></router-view>
   </div>
</template>

<script>


import UserEdit from '../components/UserEdit.vue'

export default {
  name: 'user-view',
  components: {UserEdit},

  mounted() {
    $('.ui.accordion').accordion()
  }
 
}

</script>
