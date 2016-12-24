<template>
  <div class="ui middle aligned left aligned grid">
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
      <div class="ui segment">
        <form class="ui form">
          <div class="field">
            <label>手机号或邮件</label>
            <input type="text" name="mobile" v-model="mobile" placeholder="11位手机号或邮件地址">
          </div>
          <div class="field">
            <label>密码：</label>
            <input type="password" name="password" v-model="pass" placeholder="密码，6位以上长度">
            <router-link to="/reset">忘记密码</router-link>
          </div>
          <div class="ui  large  button" @click='mylogin()'>登录</div>
          <router-link class="ui large button" to="/register">注册</router-link>
          <div class="ui error message"></div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  //lsj178@139.com 32b8f294710f5a53a6ec1a4ba48b
  //13710711847@163.com 4d9eceb647be66c2b4ea05860e59
  //1758483469@qq.com d915796743b3e0a4b4582fe04bd4
  export default {
    data() {
      return {
        mobile: '',
        pass: ''
      }
    },
    mounted() {
      $('.ui.form')
        .form({
          on: 'blur',
          fields: {
            password: {
              identifier: 'password',
              rules: [
                {
                  type: 'minLength[6]',
                  prompt: '密码需要6位以上字母或数字'
                },
                {
                  type: 'maxLength[32]',
                  prompt: '密码不得超过32位字母或数字'
                }
              ]
            }
          }
        })

    },
    methods: {
      ...mapActions(['login']),
      mylogin() {
        let rt = $('.form').form('validate form')
        if (!rt) return
        let data = { code: this.mobile, pass: this.pass }
        this.login(data)
          .then(user => {
            console.log(user)
            if (user)
              this.$router.replace(this.$route.query.redirect || '/user/' + user.uid)

          })
          
      }
    }
  }
</script>