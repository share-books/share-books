<template>
<div class="ui large secondary pointing menu" data-garbage="true">
        <router-link to="/home"   :class="myclass('/home')">首页</router-link>
        <router-link to="/new/1"  :class="myclass('/new')">最新</router-link>
        <router-link to="/top/1"  :class="myclass('/top')">最热</router-link>
        

        <div class="right menu" data-garbage="true">
          <!--  <div class="item">
                <div class="ui transparent icon input">
                    <input type="text" placeholder="Search...">
                    <i class="search link icon"></i>
                </div>
            </div>-->
            <router-link class="ui  button" v-if="authenticated" to="/logout">注销</router-link>
            <router-link class="ui primary  button" v-if="!authenticated" to="/login">登录</router-link>
        </div>
    </div>
</template>

<script>
 //:class="$route.path=='/'?'active':''"
 //:class="$route.path.startsWith('/top/')?'active':''"
//:class="$route.path.startsWith('/new/')?'active':''"
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