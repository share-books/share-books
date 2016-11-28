<template>

  <div class="ui form">
    <div class="fields">
      <div class="field">
        <label>昵称</label>
        <input type="text" v-model="displayName" placeholder="Name">
      </div>
      <div class="field">
        <label>手机号</label>
        <input type="text" v-model="phone" placeholder="Phone  Number">
      </div>
      <div class="field">
        <label>电子邮件</label>
        <input type="text" v-model="email" placeholder="email">
      </div>
    </div>
     <div class="fields">
      <div class="field">
        <img class="ui avatar image" :src="photoURL">
      </div>

      <div class="field">
        <select name="photoIdx" v-model="photoIdx" class="ui dropdown" id="avatar">
          <option value="">请选择</option>
          <option value="0">IT男</option>
          <option value="1">经理男</option>
          <option value="2">时髦女</option>
        </select>
      </div>
       <div class="ui  large  button" @click='save()'>保存</div>
    </div>
  </div>

</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data(){
    return {
    displayName:'',
    phone:'',
    email:'',
    photoIdx:''
    }
  },
  methods:{
   save(){
     console.log(this.photoIdx)
   }
  },
  computed:{
    ...mapGetters(['me']),
    photoURL(){
      let rt='/static/images/av'
      this.photoIdx=this.photoIdx||''
      return this.photoIdx.length>0?
             rt+'-'+this.photoIdx+'.jpg':rt+'.png'
    }
  } ,
  mounted() {
    this.displayName=this.me.displayName
    this.phone=this.me.phone
    this.email=this.me.email
    this.photoIdx=this.me.photoUrl
    $('#avatar').dropdown()
  }
}
</script>