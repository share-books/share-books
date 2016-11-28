<template>

  <div class="ui form">
    <div class="two fields">
      <div class="field">
        <label>昵称</label>
        <input type="text" v-model="displayName" placeholder="Name">
      </div>
  <!--    <div class="field">
        <label>手机号</label>
        <input type="text" v-model="phone" placeholder="Phone  Number">
      </div> -->
      <div class="field">
        <label>电子邮件</label>
        <input type="text" v-model="email" placeholder="email">
      </div>
    </div>
     <div class="three fields">
      <img class="ui avatar image" :src="PhotoURL">
      <div class="field">
        
        <select name="photoIdx" v-model="photoURL" class="ui dropdown" id="avatar">
          <option value="av.png">请选择</option>
          <option value="av-0.jpg">IT男</option>
          <option value="av-1.jpg">经理男</option>
          <option value="av-2.jpg">时髦女</option>
        </select>
      </div>
      <!--
       <div class="field">
         <input type="text" v-model="photoURL" placeholder="也可以是外部图片，如：http://www.pupha.net/wp-content/uploads/2014/03/Octocat.png">
      </div>-->
       <div class="ui  large  button" @click='save()'>保存</div>
       <router-link class="ui  button"  to="/me/books">我的图书</router-link>
    </div>
  </div>

</template>

<script>
import { mapGetters ,mapActions} from 'vuex'
export default {
  data(){
    return {
    displayName:'',
    phone:'',
    email:'',
    photoURL:''
      
    }
  },
  methods:{
    ...mapActions(['updateProfile']),
   save(){
     //console.log(this.photoIdx)
     this.updateProfile({
         displayName:this.displayName,
         phone:this.phone,
         email:this.email,
         photoURL:this.photoURL
       
      })
     
   }
  },
  computed:{
    ...mapGetters(['me']),
    PhotoURL(){
      return '/static/images/'+this.photoURL
    }
  } ,
  created() {
    this.displayName=this.me.displayName
    this.phone=this.me.phone
    this.email=this.me.email
    this.photoURL=this.me.photoURL||'av.png'
    $('#avatar').dropdown()
  }
}
</script>