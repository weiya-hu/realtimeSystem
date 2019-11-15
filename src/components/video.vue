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
		<div class="right" :class="show3d?'':'width'">
			<iframe src="http://www.cqkaijin.com/Production_17-1/App_cesium/" width="100%" :height="height"></iframe>
		</div>
		<div class="right" :class="show3d?'width':''">
			<div  ref='video'> 
			   <video id="videobox" class="video-js vjs-default-skin vjs-big-play-centered " controls preload="auto" webkit-playsinline="true" playsinline="true" type="application/x-mpegURL"   width='100%' ref='videoRef' x5-video-player-fullscreen="true" :poster="posterSrc"  allowsInlineMediaPlayback=YES  webview.allowsInlineMediaPlayback=YES>
			      <source id="sourceBox" :src="videoSrc">
			      <p class="vjs-no-js">不支持播放</p>
			   </video>
			</div>
			<div v-show='isError' class="errorTip"><p>啊哦，播放出错了。请刷新重试，如无法播放建议您观看其它内容。</p></div>
			<div class="loading" v-if="loadingshow">
				<img src="../assets/loading.gif"/>
			</div>
		</div>
		
		
	</div>
	
</template>

<script>
import videojs from 'video.js'
import 'videojs-contrib-hls'
export default {
  name:'Video',
  data () {
    return {
        list:[],
	    defaultProps: {
		    children: 'children',
		    label: 'name'
		},
      	radio: '1',
      	videoSrc:'http://kj.rsltek.com:8080/stream/xjw-rsltek-com-50001-streaming-channels-402/index.m3u8',
		posterSrc:'https://matrimony001.100msh.net.cn/public/code/material/mp-7261-1554175849.jpg',
   		isError:false,
   		loadingshow:false,//加载中是否显示
   		show3d:false,//3d页面是否显示
    }
  },
  mounted(){ 
      this.list=this.getnormlist();
      this.get3dlist()
      var that=this
      var player = videojs('videobox',{
	            bigPlayButton: true,
	            textTrackDisplay: true,
	            posterImage: true,
	            errorDisplay: false,
	            controlBar: false,
	            playbackRates: [0.5, 1, 1.5, 2],
	            ControlBar:{
	                customControlSpacer: true
	            }
	        },
	        function onPlayerReady(){
	            this.play();
	            setTimeout(() => {   //延时确保能监听到视频源错误
	                var mediaError = this.error();
	                if(mediaError!=null && mediaError.code){
//	                    that.isError=true
	                    console.log('啊哦，播放出错了。<br>请刷新重试，如无法播放建议您观看其它内容。')
	                }
	            },1000);
	        });        
             // player.width(this.videoW)   //设置播放器宽度
             
  },
  beforeDestroy(){
    const videoDom = this.$refs.videoRef;   //不能用document 获取节点
    videojs(videoDom).dispose();  //销毁video实例，避免出现节点不存在 但是flash一直在执行,也避免重新进入页面video未重新声明
  },
  created(){
    window.removeEventListener('resize', this.videoHeight())
  },
  destroyed(){
    window.removeEventListener('resize', this.videoHeight())
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
  		this.$http.post(that.global.domainurl+'/jeecg-boot/replace/getBidsectionList',{username:'admin',identify:'thingjs'}).then(res=>{
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
			this.show3d=true
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
			this.show3d=false
			
			this.$nextTick(()=>{
	    		const videoDom = this.$refs.videoRef;
				console.log(videoDom)
				videoDom.play();
	    	})
			
	        
  			let listnorm=localStorage.getItem("listnorm")
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
  		console.log(data)
  		if(!data.projectId){  
//			this.show3d=false
  			
	        const videoDom = this.$refs.videoRef;
	        videojs(videoDom).pause()//
	        this.loadingshow=true;
	        this.isError=false;
	        videojs(videoDom).currentTime(0);
	        let that=this
	  		this.$http.post(that.global.domainurl+'/jeecg-boot/infrastructure/video/videoAddress',{videoId:data.id}).then(res=>{
	  			console.log(res)
	  			this.loadingshow=false
				if(res.data.code===200){
					this.$message({
			            showClose: true,
			            message: '视频地址获取成功',
			            type: 'success'
			        });
					videojs(videoDom).src(res.data.result)
					videojs(videoDom).load();
					videojs(videoDom).play();
					setTimeout(() => {   //延时确保能监听到视频源错误
		                var mediaError = videojs(videoDom).error();
		                if(mediaError!=null && mediaError.code){
		                    that.isError=true
		                }
		            },1000);
				}else if(res.data.code===500){
					this.$message({
			            showClose: true,
			            message: res.data.message,
			            type: 'error'
			        });
				}
	  		}).catch(function (error){
	          console.log(error)
	        })
  		}else{
  			if(data.children){
//				this.show3d=false
  				if(data.children.length===0){
	  				this.$message({
			            showClose: true,
			            message: '此工地咱无视频监控'
			        });
	  			}
  			}else{
//				this.show3d=true
  			}
  			
  		}
     },
    videoHeight(){
    	this.$nextTick(()=>{
    		console.log(this.$refs.video)
			let vidoeWidth=this.$refs.video.clientWidth;
			this.$refs.video.style.height = vidoeWidth*0.54+'px';
			this.height=document.body.clientHeight
    	})

	}
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.videoVue{display: flex;justify-content: flex-start;align-items: flex-start;}
.left{width:220px;padding:0 10px;border-right: 1px solid #eee;}
.right{width: 100%;padding:0 10px;position: relative;}
.select{border: 1px solid #eee;}
#videobox{width: 100%;height:100%;}
.loading{position: absolute;top: 50%;left: 50%;transform: translateX(-50%) translateY(-50%);width: 45px;}
.errorTip{position: absolute;top: 50%;left: 50%;transform: translateX(-50%) translateY(-50%);padding: 15px 30px;background: #EEEEEE;border-radius: 6px;}
.loading img{width: 100%;}
.width{width: 0;}
</style>
