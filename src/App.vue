<template>
  <div class="ui container">
    <app-menu></app-menu>
    <div class="ui raised segments">
      <div class="ui segment">
         <notify></notify>
      </div>

      <div class="ui" :class="authenticated?'green segment':
                         notifyType=='error'? 'red segment':'yellow segment'">
           <router-view></router-view>
      </div>
    </div>
    
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AppMenu from './components/AppMenu.vue'
import Notify from './components/Notify.vue'

export default {
  name: 'app',
  components: {
    AppMenu,Notify
  },
  computed: mapGetters(['authenticated','me','notifyType'])
  
}
</script>
