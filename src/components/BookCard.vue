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
      
      <i class="heart outline like icon"></i>
       {{ item.likes&&item.likes.length }} 喜欢
    </span>
			<i class="comment icon" data-garbage="true"></i>
			<router-link :to="'/item/' + item.id">{{ item.kids&&item.kids.length }} 条评论</router-link>
		</div>
		<div class="extra content" v-if="authenticated">
			<div class="ui large transparent  input">

				<input type="text" placeholder="我要评价..." @keyup.13="addComment()" v-model="newComment">
			</div>
		</div>
	</div>


</template>

<script>
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
		...mapGetters(['authenticated']),
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
    ...mapActions(['addItem','loadUser']),
    addComment(){
     // addItem({title:this.newComment},this.item.id)
       console.log(this.newComment)
       this.addItem({
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