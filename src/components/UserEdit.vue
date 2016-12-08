<template>

  <div class="ui form" id="useredit">
    <div class="two fields">
      <div class="field">
        <label>昵称</label>
        <input type="text" v-model="displayName" placeholder="Name">
      </div>
      <div class="field">
        <label>电子邮件</label>
        <input type="text" v-model="email" placeholder="email">
      </div>
    </div>
     <div class="three fields">
         <img class="ui avatar image" :src="photoURL |  tansformAvatarURL">
      <div class="field">
        
        <select name="photoIdx" v-model="photoURL" class="ui dropdown" id="avatar">
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
  </div>

</template>

<script>
//v-if="user.uid==myId"
import appCfg from '../../config/app'
import { mapGetters ,mapActions} from 'vuex'
export default {

  data(){
    return {
      displayName:'',
      email:'',
      photoURL:'',
      user:{},
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
        // phone:this.phone,
         email:this.email,
         photoURL:this.photoURL
        }
     }).then(()=>{
        $('useredit').dimmer('show')

     })
    
     
   }
  },
  created() {
    this.loadUser(this.$route.params.uid).then((u)=>{
      this.user=u
      if (!u) return
      this.displayName=u.displayName
      this.email=u.email
      this.photoURL=u.photoURL||''
      $('#avatar').dropdown()
    })
   
  }
}
</script>