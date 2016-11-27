<template>
<div class="ui large secondary pointing menu" data-garbage="true">
        <router-link to="/home" class="item">关于</router-link>
        <router-link to="/top" class="item">最热</router-link>
        <router-link to="/new" class="item">最新</router-link>

        <div class="right menu" data-garbage="true">
            <div class="item">
                <div class="ui transparent icon input">
                    <input type="text" placeholder="Search...">
                    <i class="search link icon"></i>
                </div>
            </div>
            <router-link class="ui  button" v-if="authenticated" to="/logout">注销</router-link>
            <router-link class="ui primary  button" v-if="!authenticated" to="/login">登录</router-link>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
 computed: mapGetters(['authenticated','me'])
 }
</script>