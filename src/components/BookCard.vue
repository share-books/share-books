<template>


	<div class="ui card" :id="item.id">
		<div class="ui dimmer">
			<div class="content">
				<div class="center">
					<h2 class="ui inverted icon  header">
						<i class="heart icon"></i> 资料保存成功!
					</h2>
				</div>
			</div>
		</div>
		<div class="content">
			<div class="right floated meta" data-garbage="true">{{ item.time | timeAgo }}</div>

			<img class="ui avatar image" :src="this.user.photoURL | tansformAvatarURL">
			<router-link :to="'/user/' + item.uid">{{ item.by }}</router-link>
		</div>
		
			<img :src="face | tansformImageURL" class="ui medium image">
	
		<div class="content">
			<p class="header">{{ item.title }}</p>
			<span class="right floated">
      
      <i class="heart outline like icon" @click="iLike" v-if="authenticated"></i>
       喜欢:{{ likes.length }} 
    </span>
			<i class="comment icon" data-garbage="true"></i>
			<router-link :to="'/item/' + item.id">评论:{{ kids.length}} </router-link>
		</div>
		<div class="extra content" v-if="authenticated">
			<div class="ui large transparent  input">

				<input type="text" placeholder="我要评价..." @keyup.13="addComment()" v-model="newComment">
			</div>
		</div>
	</div>


</template>

<script>
import {ObjPropKeys2Array,ObjIntPropKeys2Array} from '../util'
import { mapGetters ,mapActions} from 'vuex'

export default {
 // name: 'book-card',
  props: ['item'],
  data() {
    return { 
			user:{},
			newComment:''
			}
  },
  created(){
		let self=this
    this.loadUser(this.item.uid).then(u=>{
       self.user=u
		})
  },
  computed:{
		...mapGetters(['authenticated','myId']),
    kids(){
			 return ObjIntPropKeys2Array(this.item.kids)
	  },
		likes(){
			 return ObjPropKeys2Array(this.item.likes)
	  },
 
		face(){  
       let imgs=this.item.images||'empty.png'//['dog-1.jpg','dog-2.jpg','dog-3.jpg','dog-0.jpg']
	  // console.log(imgs)
	   let ds=imgs.split(' ')
		 let idx=Math.floor(Math.random()*ds.length)
	  // console.log(ds)
	   
      return ds[idx]
    }
	},
  methods:{
    ...mapActions(['addItem','loadUser','likeItem']),
		iLike(){
      console.log(this.myId,'like',this.item.title)
			this.likeItem({uid:this.myId,id:this.item.id})
		},
    addComment(){
     // addItem({title:this.newComment},this.item.id)
       console.log(this.newComment)
       this.addItem({
				        uid:this.item.uid,
                title:this.newComment,
                parent:this.item.id
           
       }).then(()=>{
         this.newComment=''
         $('#'+this.item.id).dimmer('show')

       })
    }
  }
}
</script>