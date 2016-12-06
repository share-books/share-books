<template>
<div class="event">
    <div class="label">
      <img :src="userIcon()">
    </div>
    <div class="content">
      <div class="summary">
        <a>{{info.userName}}</a> {{info.eventName}} <a>{{info.title}}</a>
        <div class="date">
          {{info.eventTime | timeAgo }}
        </div>
      </div>
   <div class="extra images">
        <img v-for="img in info.images" :src="img">
      </div>
    </div>
</div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  replace: true,
  name: 'feed',
  data(){
      return {
          user:{},
          item:{},
          info:{
              title:'',
              userIcon:'',
              userName:'',
              images:[],
              eventName:''


          },
          indexs:[
                {id:'',file:'av.png',text:'请选择'},
                {id:'1',file:'av-0.jpg',text:'IT男'},
                {id:'2',file:'av-1.jpg',text:'经理男'},
                {id:'3',file:'av-2.jpg',text:'时髦女'}
          ]
      }
  },
  props: {
    record: Object
  },
  async created(){
      this.user=await this.loadUser(this.record.uid)
      this.item=await this.loadItem(this.record.id)
      this.info.userName=this.user.displayName
      this.info.eventName=this.record.event
      this.info.eventTime=this.item.time
      this.info.title=this.item.title
      this.info.userIcon=this.userIcon()
      this.info.images=this.images()

  },
 
  
  methods:{
    ...mapActions(['loadItem','loadUser']),
    images(){
        let rt=this.item.images||[]
        let ds=[]
        rt.forEach(p=>{
            if (p.startsWith('http'))
               ds.push(p)
            else  ds.push('/static/images/'+p)
        })
       console.log(ds)
       return ds
    },
    userIcon(){
        
        if (!this.user||!this.user.photoURL)
          return '/static/images/av.png'
        let url=this.user.photoURL
        let cfg=this.indexs.find(p=>p.id==url)
      return url.startsWith('http')?
             url:'/static/images/'+cfg.file
    }
  }

}
</script>