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
        <div class="ui stacked segment">
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
          <div class="ui  large primary button" @click='login2()'>登录</div>
        </div>
   
         <div  class="ui error message"></div>
      </form>

      <div class="ui message">
        还未注册? <a href="#">注册</a>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      mobile: '13640327787',
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
                  type   : 'empty',
                  prompt : '亲！请输入手机号'
                }
              ]
            },
            password: {
              identifier  : 'password',
              rules: [
                {
                  type   : 'empty',
                  prompt : '亲！请输入密码'
                },
                {
                  type   : 'length[4]',
                  prompt : '密码需要4位以上字符'
                }
              ]
            }
          }
        })
    
},

methods:{
    login2 () {
      let rt= $('.form').form('validate form')
      if (!rt) return
      let self=this
      self.beginLoad()
      self.login({mobile:this.mobile, pass:this.pass, cb:user => {
            self.afterLoad()
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
            this.$router.replace(this.$route.query.redirect || '/')
        
      }})
   },
   ...mapActions(['beginLoad','afterLoad','login','notify'])
  }
   
 

}
</script>

