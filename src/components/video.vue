<template>
	<div class="videoVue">
		<div class="left">
			<div class="select">
				<el-radio v-model="radio" label="1" @change='selectchange'>常规列表</el-radio>
  				<el-radio v-model="radio" label="2" @change='selectchange'>3D列表</el-radio>
			</div>
			<div id="list">
				<el-tree :data="list" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
			</div>
		</div>
		<div class="right">
			
		</div>
	</div>
</template>

<script>
export default {
  name:'Video',
  data () {
    return {
        list:[],
	    defaultProps: {
		    children: 'children',
		    label: 'name'
		},
      	radio: '1'
    }
  },
  mounted(){ 
      this.list=this.getnormlist();
      this.get3dlist()
    },
  methods:{
  	//获取常规标段列表
  	getnormlist(){
  		let that=this
  		this.$http.post(that.global.domainurl+'/jeecg-boot/replace/getVideoTree',{username:'admin'}).then(res=>{
  			if(res.data.code===200){
				that.list=res.data.result
				localStorage.setItem("listnorm",JSON.stringify(res.data.result));
				return res.data.result
  			}
  		}).catch(function (error){
          console.log(error)
        })
  	},
  	//获取3d标段列表
  	get3dlist(){
  		let that=this
  		this.$http.post(that.global.domainurl+'/jeecg-boot/replace/getBidsectionList',{username:'admin',identify:'thingjS'}).then(res=>{
  			if(res.data.code===200){
//				that.list=res.data.result;
  				console.log(that.list)
  				localStorage.setItem("list3d",JSON.stringify(res.data.result));
  				return res.data.result
  			}
  		}).catch(function (error){
          console.log(error)
        })
  	},
  	//radio==='2'为3d，'1'为常规默认
  	selectchange(){
  		let that=this;
  		if(this.radio==='2'){
  			//如果缓存中存在取缓存的list，没有久接口获取
  			let list3d=localStorage.getItem("list3d")
  			console.log(list3d)
  			if (list3d){
  				this.list=JSON.parse(list3d)
  				console.log(this.list)
  			}else{
  				this.list=this.get3dlist()
  				console.log(this.list)
  			}
  		}else if(this.radio==='1'){
  			
  			let listnorm=localStorage.getItem("listnorm")
  			console.log(listnorm)
  			if (listnorm){
  				this.list=JSON.parse(listnorm)
  				console.log(this.list)
  			}else{
  				this.list=this.getnormlist()
  				console.log(this.list)
  			}
  			
  		}
  	},
  	handleNodeClick(data) {
        console.log(data);
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.left{width:220px;}
.select{border: 1px solid #eee;}
</style>
