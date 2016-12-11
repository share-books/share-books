<template>
  <div class="ui middle aligned center aligned grid">
    <div class="column">
      <h2 class="ui teal image header">
        <img src="../assets/turnkey.png" class="image">
        <div class="content">
          登录系统
        </div>
      </h2>

      <p v-if="$route.query.redirect">
        你要访问的内容有保护，请先登录系统！
      </p>
   

      <form class="ui large form">
        <div class="ui  segment">
          <div class="field">
            <div class="ui left icon input">
              <i class="user icon"></i>
              <input type="text" name="mobile" v-model="mobile" placeholder="Phone number">
            </div>
          </div>
          <div class="field">
            <div class="ui left icon input">
              <i class="lock icon"></i>
              <input type="password" name="password" v-model="pass" placeholder="Password">
            </div>
          </div>
          <div class="ui  large  button" @click='mylogin()'>登录</div>
           <router-link class="ui large button"  to="/register">注册</router-link>
        </div>
   
         <div  class="ui error message"></div>
        <div>
     
      </form>

     
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      mobile: '13612345678',
      pass: '123456'
    }
  },
  mounted() {
     $('.ui.form')
        .form({
          on: 'blur',
          fields: {
            mobile: {
              identifier  : 'mobile',
              rules: [
                 {
                  type   : 'regExp[/^[0-9]{11,11}$/]',
                  prompt : '请输入11位手机号'
                 }
              ]
            },
            password: {
              identifier  : 'password',
              rules: [
                
                {
                 type   : 'minLength[6]',
                  prompt : '密码需要6位以上字母或数字'
                },
                 {
                 type   : 'maxLength[32]',
                  prompt : '密码不得超过32位字母或数字'
                }
              ]
            }
          }
        })
    
},

methods:{
    mylogin () {
      let rt= $('.form').form('validate form')
      if (!rt) return
      let self=this
      self.login({mobile:this.mobile, pass:this.pass})
          .then(user => {
            let state={}
            if(!user) {
              state.type = 'error'
              state.notify = '请检查手机号及密码是否正确！'
              self.notify(state)
              return 
            }
            state.type = 'info'
            state.notify = '欢迎您：'+user.displayName
            self.notify(state)
           if (!!user) 
             this.$router.replace(this.$route.query.redirect || '/user/'+user.uid)
         })
   },
   ...mapActions(['beginLoad','afterLoad','login','notify'])
  }
   
 

}
</script>

