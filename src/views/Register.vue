<template>
  <div class="ui middle aligned center aligned grid">
    <div class="column">
      <h2 class="ui teal image header">
        <img src="../assets/turnkey.png" class="image">
        <div class="content">
          注册新用户
        </div>
      </h2>



      <form class="ui  form">
        <div class="ui left aligned segment">
          <div class="field">
            <label>手机号：</label>
            <input type="text" name="mobile" v-model="mobile" placeholder="11位手机号">
          </div>
          <div class="field">
            <label>密码：</label>
            <input type="password" name="password" v-model="pass" placeholder="设置新密码，6位以上长度">

          </div>
          <div class="ui  large  button" @click='check()'>保存</div>
        </div>

        <div class="ui error message"></div>

      </form>


    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'

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
            mobile: {
              identifier: 'mobile',
              rules: [
                {
                  type: 'regExp',
                  value: /^1[34578]\d{9}$/,
                  prompt: '请输入11位手机号'
                }
              ]
            },
            password: {
              identifier: 'password',
              rules: [
                {
                  type: 'minLength[6]',
                  prompt: '密码需要6位以上字母或数字'
                }, {
                  type: 'maxLength[32]',
                  prompt: '密码不得超过32位字母或数字'
                }
              ]
            }
          }
        })

    },

    methods: {
      check() {
        let rt = $('.ui.form').form('validate form')
        if (!rt) return
        let self = this
        let res = {}
        self.beginLoad()
        self.register({ mobile: this.mobile, pass: this.pass })
          .then(user => {
            self.afterLoad()
            this.$router.replace('/login')
          }).catch(ex => {
            console.log(ex)
            self.afterLoad()
            res.type = 'error'
            res.notify = '手机号错误或者改号已经被注册！'
            self.notify(res)

          })

      },
   ...mapActions(['beginLoad','afterLoad','register','notify'])
    }



  }
</script>