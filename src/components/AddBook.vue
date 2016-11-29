<template>
<div id="newbook">
  <div class="ui form" >
      <div class="field">
        <label>标题</label>
        <input type="text" v-model="title" placeholder="少于30个汉字">
      </div>
      <div class="field">
        <label>搜索关键字</label>
        <input type="text" v-model="keywords" placeholder="5～8个关键字，空格或逗号分开">
      </div>
      <div class="field">
        <label>内容介绍</label>
        <input type="text" v-model="text" placeholder='特殊用法:换行--&lt;br&gt;　图片引用--&lt;img src="http://服务器地址/名称.后缀"&gt;'>
      </div>
      <div class="ui  large  button" @click='save()'>保存</div>
  </div>

  <div class="ui dimmer">
      <div class="content">
        <div class="center">
          <h2 class="ui inverted icon  header">
            <i class="heart icon"></i> 成功加入新图书!
          </h2>
        </div>
      </div>
    </div>
  </div>   
</div>   
</template>

<script>
import { mapActions} from 'vuex'
export default {
  data(){
    return {
    title:'',
    keywords:'',
    text:''
      
    }
  },
  methods:{
    ...mapActions(['addItem']),
   save(){
     //console.log(this.photoIdx)
     this.addItem({item:{
         title:this.title,
         keywords:this.keywords,
         text:this.text
     }})
     $('#newbook').dimmer('show')
     
   }
  }
}
</script>