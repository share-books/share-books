<template>
  <div class="ui form" id="useredit">
    <div class="two fields">
      <div class="field">
        <label>昵称</label>
        <input type="text" v-model="displayName" placeholder="昵称">
      </div>
      <div class="field">
        <label>城市</label>
        <input type="text" v-model="city" placeholder="所在城市">
      </div>
   </div>
     <div class="two fields">
      <div class="field">
        <label>手机</label>
        <input type="text" v-model="phone" placeholder="手机号">
      </div>
      <div class="field">
        <label>电子邮件</label>
        <input type="text" v-model="email" placeholder="电子邮件">
      </div>
    </div>
    <div class="three fields">
 
       <img class="ui avatar image" :src="photoURL |  tansformAvatarURL">
      <div class="field">
       
        <select name="photoIdx" v-model="photoIndex" @change="photoURL=photoIndex"class="ui dropdown" id="avatar">
           <option v-for="data in map" :value="data.id">{{data.text}}</option>
        </select>
      </div>
      <div class="field">
         <input type="text" v-model="photoURL" placeholder="也可以是外部图片，如：http://www.pupha.net/wp-content/uploads/2014/03/Octocat.png">
      </div>
       <div class="ui button" v-if="itsMe($route.params.uid)" @click='save()'>保存</div>
       <router-link class="ui primary button"  :to="booksURL">查看图书</router-link>
      
    </div>
    <div class="ui dimmer">
      <div class="content">
        <div class="center">
          <h2 class="ui inverted icon  header">
            <i class="heart icon"></i> 成功更新资料!
          </h2>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import appCfg from '../../config/app'
import { mapActions} from 'vuex'
export default {

  data(){
    return {
      displayName:'',
      city:'',
      email:'',
      photoIndex:'',
      photoURL:'',
      phone:{},
      map:appCfg.AVATAR.MAP
    }
  },
  computed:{
      booksURL(){
       return '/user/'+this.$route.params.uid+'/books'
    }
  },
  methods:{
    ...mapActions(['updateProfile','loadUser']),
   save(){
     //console.log(this.photoIdx)
     this.updateProfile({user:{
         displayName:this.displayName,
         city:this.city,
         email:this.email,
         phone:this.phone,
         photoURL:this.photoURL
        }
     }).then((rt)=>{
       console.log(rt)
        $('#useredit').dimmer('show')
     })
   }
  },
  created() {
    this.loadUser(this.$route.params.uid).then((u)=>{
     // $('#useredit').dimmer()
      if (!u) return
      
      this.displayName=u.displayName
      this.email=u.email
      this.phone=u.phone
      this.city=u.city||'广州'
      this.photoURL=u.photoURL||''
      $('#avatar').dropdown()
    })
   
  }
}
</script>