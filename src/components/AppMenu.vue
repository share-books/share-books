<template>
<div class="ui  secondary pointing menu" data-garbage="true">
        <router-link to="/home"   :class="myclass('/home')">首页</router-link>
        <router-link to="/new"  :class="myclass('/new')">最新</router-link>
        <router-link to="/top"  :class="myclass('/top')">最热</router-link>
        

        <div class="right menu" data-garbage="true">
            <router-link class="ui  button" v-if="authenticated" to="/logout">注销</router-link>
            <router-link class="ui small primary  button" v-if="!authenticated" to="/login">登录</router-link>
        </div>
    </div>
</template>

<script>

import { mapGetters } from 'vuex'
export default {
    methods:{
        myclass(url){
         let rt='item';
         if (this.$route.path===url||this.$route.path.startsWith(url))
           rt='active '+rt
         return rt
       }
    },
    computed: mapGetters(['authenticated'])
}
</script>