<template>

<div class="ui form">
  <div class="fields">
    <div class="field">
      <label>昵称</label>
      <input type="text" placeholder="Name">
    </div>
    <div class="field">
      <label>手机号</label>
      <input type="text" placeholder="Phone  Number" :value="me.phone">
    </div>
    <div class="field">
      <label>电子邮件</label>
      <input type="text" placeholder="email">
    </div>
  </div>
</div>

</template>

<script>
import { mapGetters } from 'vuex'
export default {
 computed: mapGetters(['me'])
 }
</script>