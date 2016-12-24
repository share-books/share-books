<template>
  <div class="ui myitem modal" data-garbage="true">
    <div class="header" data-garbage="true">{{header}}</div>
    <div class="content">
      <div class="ui form">
        <div class="field">
          <label>标题</label>
          <input type="text" v-model="title" placeholder="少于30个汉字">
        </div>
        <div class="field" v-if="type=='book'">
          <label>搜索关键字</label>
          <input type="text" v-model="keywords" placeholder="5～8个关键字，空格或逗号分开">
        </div>
        <div class="field" v-if="type=='book'">
          <label>图片地址</label>
          <input type="text" v-model="images" placeholder="多个地址用空格分开">
          <upload :filesLimit="4" :fileSize="6" @uploaded="uploaded"></upload>
        </div>
        <div class="field">
          内容介绍<a href="http://www.markdown.cn/" target="_blank" rel='noopener noreferrer'>
          [markdown语法参考]
          </a>
          <div id="editor">
            <textarea v-model="text"></textarea>
            <article v-if="text" v-html="markdown2Html(text)"></article>
          </div>


        </div>
      </div>
    </div>
    <div class="actions">
      <div class="ui  button" @click="save">保存</div>
      <div class="ui cancel button">取消</div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { mapGetters, mapActions } from 'vuex'
  import { msgBus } from '../store'

  import Upload from './Upload.vue'

  export default {
    props: {
      //  mode: String,
      type: String,
      itemId: Number
    },
    components: {
      Upload
    },
    data() {

      return {
        header: '',
        title: '',
        keywords: '',
        images: 'http://',
        text: ''
      }
    },
   mounted() {
      this.load()
      $('.myitem.modal').modal()
    },

    methods: {
      ...mapActions(['addItem','updateItem','loadItem','award']),
      uploaded(filenames) {
        let rs = filenames.join(' ')
        this.images = rs
        //console.log(rs)
      },
       load() {
        let isAdd = (this.itemId == 0)
        this.header = isAdd ? '新增资料' : '修改资料'
        if (isAdd)
          return
        let self = this

        this.loadItem(this.itemId).then(item => {
          if (!item) {
            console.log('not found : ', this.itemId)
            return

          }

          self.title = item.title
          self.keywords = item.keywords
          self.images = item.images
          self.text = item.text
        })
        //Vue.nextTick(function () {
        //  console.log(self.title)
        //})

      },
      save() {
        //console.log('save')
        $('.myitem.modal')
          .modal("hide")
        if (this.itemId == 0) {
          this.addItem({
            title: this.title,
            parent: 0,
            type: '',
            keywords: this.keywords,
            text: this.text,
            images: this.images
          }).then((it) => {
            // $('#itemedit').dimmer('show')
            msgBus.$emit('ItemAdded', it)
            this.award(this.myId)
          })
        } else {
          let item = {
            // uid:this.myId,
            id: this.itemId,
            title: this.title,
            keywords: this.keywords,
            text: this.text,
            images: this.images
          }
          this.updateItem(item).then(() => {
            msgBus.$emit('ItemUpdated', item)
          })
        }
      }
    }
  }

</script>