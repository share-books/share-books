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
import { mapGetters ,mapActions} from 'vuex'
import {msgBus} from '../store'
export default {
  data(){
    return {
    title:'',
    keywords:'',
    text:''
      
    }
  },
  //computed: mapGetters(['msgBus']),
  methods:{
    ...mapActions(['addItem']),
   save(){
     this.addItem({
         title:this.title,
         parent:0,
         type:'',
         keywords:this.keywords,
         text:this.text
     }).then((book)=> {
       $('#newbook').dimmer('show')
        msgBus.$emit('addNewBook',book) 
    })
     
   }
  }
}
</script>