<template>
    <form class="ui form">
           <img class="ui avatar image" :src="PhotoURL">
           <select name="photoIdx" v-model="photoIdx" class="ui dropdown" id="avatar">
              <option v-for="data in indexs" :value="data.id"><{{data.text}}/option>
           </select>
           <input type="text" v-model="photoURL" 
           placeholder="也可以是外部图片，如：http://www.pupha.net/wp-content/uploads/2014/03/Octocat.png">
      </form>
   
</template>

<script>
export default {
  data(){
    return {
      photoIdx:'',
      photoURL:'',
      indexs:[
         {id:'',file:'av.png',text:'请选择'},
         {id:'1',file:'av-0.jpg',text:'IT男'},
         {id:'2':file:'av-1.jpg',text:'经理男'},
         {id:'3':file:'av-2.jpg',text:'时髦女'}
      ]
    
    }
  },
  watch: {
    photoIdx (to) {
      this.photoURL=to
    },
  },
  computed:{
    PhotoURL(){
      let url=this.photoURL.trim()
      let item=this.indexs.find(p=>p.id==url)
      return url.startWith('http')?
             url:'/static/images/'+item.file
    }
  } ,
  created() {
    
    $('#avatar').dropdown()
  }
}
</script>