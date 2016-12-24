<template>
 
  <div class="ui segment">
      <form class="ui  form">
          <div class="field">
              <label>手机号：</label>
              <input type="text" name="mobile" v-model="mobile" placeholder="11位手机号">
            </div>
            <div class="field">
              <div v-if="flag" class="ui  button" @click="sendResetPwdSms()">找回密码</div>
              <label>验证码：</label>
              <input type="text" name="code" v-model="code" placeholder="请输入收到的验证码">

            </div>

            <div class="field">

              <label>密码：</label>
              <input type="password" name="password" v-model="pass" placeholder="设置新密码，6位以上长度">

            </div>
            <div class="ui large button" @click="sendConfirmPwdSms()">重设密码</div>
            <div class="ui error message"></div>
     </form>

  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'

  export default {
    data() {
      return {
        mobile: '',
        code: '',
        pass: '',
        flag: true
      }
    },
    mounted() {
      $('.ui.form')
        .form({
          on: 'blur',
          fields: {
            mobile: {
              identifier: 'mobile',
              rules: [
                {
                  type: 'regExp',
                  value: /^1[34578]\d{9}$/,
                }
              ]
            },
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
       ...mapActions(['confirmPasswordResetSms','sendPasswordResetSms']),
       sendResetPwdSms() {
        console.log('sendResetPwdSms')
        this.flag = false
        let self = this
        setTimeout(() => {
          this.flag = true
        }, 30000)
        this.sendPasswordResetSms(this.mobile)
      },
      sendConfirmPwdSms() {
        //let rt = $('.form.2').form('validate form')
        // if (!rt) return
        let self = this
        console.log('sendConfirmPwdSms')
        this.confirmPasswordResetSms({
          phone: this.mobile,
          code: this.code,
          newPassword: this.pass
        }).then((msg) => {
           console.log(msg)
           this.$router.replace('/login')
        })
      }
    }
 }
</script>