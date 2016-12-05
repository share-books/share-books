<template>

  <div class="ui form" id="setting">
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
         <img class="ui avatar image" :src="PhotoURL">
      <div class="field">
        
        <select name="photoIdx" v-model="photoURL" class="ui dropdown" id="avatar">
           <option v-for="data in indexs" :value="data.id">{{data.text}}</option>
        </select>
      </div>
      <div class="field">
         <input type="text" v-model="photoURL" placeholder="也可以是外部图片，如：http://www.pupha.net/wp-content/uploads/2014/03/Octocat.png">
      </div>
       
    
       <div class="ui button" v-if="isMe" @click='save()'>保存</div>
       <router-link class="ui primary button"  :to="booksURL">拥有图书</router-link>
      
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
import { mapGetters ,mapActions} from 'vuex'
export default {

  data(){
    return {
      displayName:'',
      email:'',
      photoURL:'',
      user:{},
      indexs:[
         {id:'',file:'av.png',text:'请选择'},
         {id:'1',file:'av-0.jpg',text:'IT男'},
         {id:'2',file:'av-1.jpg',text:'经理男'},
         {id:'3',file:'av-2.jpg',text:'时髦女'}
      ]
    }
  },
  computed:{
    ...mapGetters(['myId']),
    PhotoURL(){
      let url=this.photoURL.trim()
      let item=this.indexs.find(p=>p.id==url)
      return url.startsWith('http')?
             url:'/static/images/'+item.file
    },
    booksURL(){
       return '/user/'+this.$route.params.uid+'/books'

    },
    isMe(){
      return this.$route.params.uid==this.myId

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
        $('#setting').dimmer('show')

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