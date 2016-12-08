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
        </div>
        <div class="field">
          <label>内容介绍</label>
          <textarea v-model="text" placeholder='特殊用法:换行--&lt;br&gt;　图片引用--&lt;img src="http://服务器地址/名称.后缀"&gt;'></textarea>

        </div>
      </div>
    </div>
    <div class="actions">
      <div class="ui approve button">保存</div>
      <div class="ui cancel button">取消</div>
    </div>
  </div>
</template>

<script>
/*
  <div class="ui dimmer">
      <div class="content">
        <div class="center">
          <h2 class="ui inverted icon  header">
            <i class="heart icon"></i> 资料保存成功!
          </h2>
        </div>
      </div>
    </div>
*/
import { mapGetters ,mapActions} from 'vuex'
import {msgBus} from '../store'
export default {
  props: {
    mode: String,
    type:  String,
    item: Object
  },
  data(){
    
    return {
      header:'',
      title:'',
      keywords:'',
      images:'',
      text:''
    }
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    'item': 'match'
  },
  methods:{
    ...mapActions(['addItem']),
    match(item){
       console.log('item change: ',item.title)
       this.header=item.id?'新增资料':'修改资料'
       this.title=item.id?item.title:''
       this.keywords=item.id?item.keywords:''
       this.images=item.id?item.images:''
       this.text=item.id?item.text:''

    },
   save(){
     if (this.mode=='add'){
       this.addItem({
         title:this.title,
         parent:this.item.parent,
         type:'',
         keywords:this.keywords,
         text:this.text,
         images:this.images
       }).then((book)=> {
          // $('#itemedit').dimmer('show')
            msgBus.$emit('addItem',book) 
        })
     }else{
      console.log('update',this.title )
    /*  this.updateItem({
         id:this.id,
         title:this.title,
         text:this.text
     }).then((book)=> {
      // $('#itemedit').dimmer('show')
        msgBus.$emit('updateItem',book) 
    })*/
   }
  }
 }
}

</script>