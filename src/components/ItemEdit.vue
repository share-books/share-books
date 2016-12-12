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
			<div class="ui  button" @click="save">保存</div>
			<div class="ui cancel button">取消</div>
		</div>
	</div>
</template>

<script>
import Vue from 'vue'
import { mapActions} from 'vuex'
import {msgBus} from '../store'
export default {
  props: {
  //  mode: String,
    type:  String,
    itemId: Number
  },
 
  data(){
    
    return {
      header:'',
     // item:{},
      title:'',
      keywords:'',
      images:'',
      text:''
    }
  },
// computed: mapGetters(['myId']), 
 mounted() {
    this.load()
    $('.myitem.modal').modal()
  },

  methods:{
    ...mapActions(['addItem','updateItem','loadItem']),
    load(){
      //console.log('load :',this.itemId)
      let isAdd=(this.itemId==0)
      this.header=isAdd?'新增资料':'修改资料'
      if (isAdd)
        return
      let self=this
     // console.log(this.header)
      this.loadItem(this.itemId).then(item=>{
         if(!item){
           console.log('not found : ',this.itemId)
           return

         }
            
         self.title=item.title
         self.keywords=item.keywords
         self.images=item.images
         self.text=item.text
       })
       //Vue.nextTick(function () {
       //  console.log(self.title)
       //})

    },
   save(){
     //console.log('save')
      $('.myitem.modal')
      .modal("hide")
     if (this.itemId==0){
       this.addItem({
         title:this.title,
         parent:0,
         type:'',
         keywords:this.keywords,
         text:this.text,
         images:this.images
       }).then((it)=> {
          // $('#itemedit').dimmer('show')
            msgBus.$emit('ItemAdded',it) 
        })
     }else{
      let item={
       // uid:this.myId,
        id:this.itemId,
        title:this.title,
        keywords:this.keywords,
        text:this.text,
        images:this.images
      }
       this.updateItem(item).then(()=> {
            msgBus.$emit('ItemUpdated',item) 
       })
   }
  }
 }
}

</script>