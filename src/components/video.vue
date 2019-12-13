<template>
	<div class="videoVue" id="videocont">
		<div class="left" :style="'height:'+height">
			<div class="select flex">
				<el-radio v-model="radio" label="1" @change='selectchange'>常规列表</el-radio>
  				<el-radio v-model="radio" label="2" @change='selectchange'>3D列表</el-radio>
			</div>
			<div id="list " class="list">
				<div v-for="(item,indx) in list">
					<div class="listpre flexl"  @click="handlelistpre(item,indx)" :class="item.active?'itemsontxtactive':''">
						<div  class="fleximg" style="flex: 1;">
							<div v-if="item.children && item.children.length>0" class="righticon" :class="item.ispull?'righticonxiala':''">
								<img src="../assets/righticon.png"/>
							</div>
						</div>
						<div class="listpretxt">{{item.name}}</div>
					</div>
					<div class="itemxiala" v-for="(itemson,index) in item.children" @click="handleNodeClick(itemson,indx,index)">
						<div class="itemsontxt" :class="[item.ispull?'itemsontxtxiala':'',itemson.state==='未知'?'itemsontxtwarn':'',itemson.state==='离线'?'itemsontxtno':'',itemson.isactive?'itemsontxtactive':'']" >
							{{itemson.name}}
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="right"  v-if="show3d">
			<iframe :src="list[num3d].vraddress" :height="height" allowfullscreen="true" allowtransparency="true" style="width: 100%;position: relative;z-index: 999999;"></iframe>
		</div>
		<div class="right" :class="show3d?'width':''">
			<div  ref='video'> 
			   <video id="videobox" class="video-js vjs-default-skin vjs-big-play-centered " controls='true' webkit-playsinline="true" playsinline="true" type="application/x-mpegURL"   width='100%' ref='videoRef' x5-video-player-fullscreen="true" :poster="posterSrc"  allowsInlineMediaPlayback=YES  webview.allowsInlineMediaPlayback=YES>
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
import _ from 'lodash'
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
      	videoSrc:'http://down.soundaer.com/live/stream_89003_sd/playlist.m3u8?k=d708550fbd49c58a1b8a8412c8623277&t=1553687908',
		posterSrc:'',
   		isError:false,
   		loadingshow:false,//加载中是否显示
   		show3d:false,//3d页面是否显示
   		height:'',//页面高度
   		num3d:0,//3d的选中项下标
   		videoheight:'',//视频播放器高度
    }
  }, 
  mounted(){ 
      this.list=this.getnormlist();
      this.get3dlist()
      var that=this; 
      this.videoHeight()
      var player = videojs('videobox',{
        bigPlayButton: true,
        textTrackDisplay: true,
        posterImage:true,
        errorDisplay: false,
        controlBar:true,
        playbackRates: [0.5, 1, 1.5, 2],
        ControlBar:{
            customControlSpacer: true
        }},
        function onPlayerReady(){
            setTimeout(() => {   //延时确保能监听到视频源错误
                var mediaError = this.error();
                if(mediaError!=null && mediaError.code){
                    console.log('啊哦，播放出错了。<br>请刷新重试，如无法播放建议您观看其它内容。')
                }
            },1000);
        }
	);            
  },
  destroyed(){
    const videoDom = this.$refs.videoRef;   //不能用document 获取节点
    videojs(videoDom).dispose();  //销毁video实例，避免出现节点不存在 但是flash一直在执行,也避免重新进入页面video未重新声明
    let that=this;
    window.removeEventListener('resize', function(){
       that.$refs.video.style.height =(document.documentElement.clientHeight).toFixed(2)+'px';
		that.height=(document.documentElement.clientHeight).toFixed(2)+'px';
    })
  },
    created(){
        let that=this;
        window.addEventListener('resize', function(){
            that.$refs.video.style.height =(document.documentElement.clientHeight).toFixed(2)+'px';
			that.height=(document.documentElement.clientHeight).toFixed(2)+'px';
        });
    },
  methods:{
  	//获取常规标段列表
  	getnormlist(){
  		let that=this
  		this.$http.post(that.global.domainurl+'/jeecg-boot/replace/getVideoTree',{username:that.UrlSearch()}).then(res=>{
  			if(res.data.code===200){
  				let arr=res.data.result
  				//给常规list下每一项添加ispull=false，开始都没有下拉，ispull=true当前项下拉
  				for(let i=0,l=arr.length;i<l;i++){
  					arr[i].ispull=false
  					if(arr[i].children.length>0){
  						//给常规list下每一项的children添加isactive=false，isactive=true的时候是被选中的状态
  						for(let j=0,th=arr[i].children.length;j<th;j++){
  							arr[i].children[j].isactive=false
  						}
  					}
  				}
				that.list=arr
				//存入内存，下次点击切换先查看内存中是否有，没有才请求接口获取
				localStorage.setItem("listnorm",JSON.stringify(arr));
				return arr
  			}
  		}).catch(function (error){
          console.log(error)
        })
  	},
  	//获取3d标段列表
  	get3dlist(){
  		let that=this
  		this.$http.post(that.global.domainurl+'/jeecg-boot/replace/getBidsectionList',{username:that.UrlSearch(),identify:'3d'}).then(res=>{
  			if(res.data.code===200){
				let arr=res.data.result;
				//3dlist里面默认每一项都没有选中，active=true为选中状态
				for(let i=0,l=arr.length;i<l;i++){
					arr[i].active=false
				}
				//因为当前只有一个3d示例，所以暂时列第一个为默认选中项
				arr[0].active=true;
  				localStorage.setItem("list3d",JSON.stringify(arr));
  				return arr                                       
  			}
  		}).catch(function (error){
          console.log(error)
        })
  	},
  	UrlSearch(){
		let url = window.location.href;
//      let url='http://kaijin.zhoumc.cn/dist/#/video?username=admin'
        let m=url.split('?')[1].split('&')
        let obj={}
        for(let i=0;i<m.length;i++){
          let a=m[i].split('=')
          obj[a[0]]=a[1]
        }
        return obj.username
    },
  	//radio==='2'为3d，'1'为常规默认
  	selectchange(){
  		let that=this;
  		console.log(this.radio)
		if(this.radio==='2'){
			this.show3d=true
			//如果缓存中存在取缓存的list，没有久接口获取
			
			let list3d=localStorage.getItem("list3d")
			if (list3d){
				this.list=JSON.parse(list3d)
				console.log(this.list)
			}else{
				this.list=this.get3dlist()
				console.log(this.list)
			}
		}else if(this.radio==='1'){
			this.show3d=false
			let listnorm=localStorage.getItem("listnorm")
			if (listnorm){
				this.list=JSON.parse(listnorm)
				console.log(this.list)
			}else{
				this.list=this.getnormlist()
				console.log(this.list)
			}			
		}
		console.log(this.list)
  	},
  	//点击隧道内视频点,_.debounce防抖
  	handleNodeClick:_.debounce(function(data,indx,index) {
  		let arr=this.list;
  		for(let i=0,l=arr.length;i<l;i++){
			if(arr[i].children.length>0){
				for(let j=0,th=arr[i].children.length;j<th;j++){
					arr[i].children[j].isactive=false
				}
			}
		}
  		arr[indx].children[index].isactive=true
  		this.list=arr;
  		localStorage.setItem("listnorm",JSON.stringify(arr));
  		console.log(data)
        const videoDom = this.$refs.videoRef;
        videojs(videoDom).pause()
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
		            message: data.name+'  视频地址获取成功',
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

     },500),
    videoHeight(){
    	this.$nextTick(()=>{
    		console.log(this.$refs.video)
			this.$refs.video.style.height =(document.documentElement.clientHeight).toFixed(2)+'px';
			this.height=(document.documentElement.clientHeight).toFixed(2)+'px';
    	})

	},
	//点击隧道
    handlelistpre(item,indx){
    	console.log(item)
    	//点击常规隧道项，因为常规隧道都没有children
    	if(item.children){
//				this.show3d=false
			if(item.children.length===0){
  				this.$message({
		            showClose: true,
		            message: '此工地暂无视频监控'
		        });
  			}else if(item.children.length>0){
	    		let list=this.list
	    		list[indx].ispull=!list[indx].ispull
	    		localStorage.setItem("listnorm",JSON.stringify(list));
	    		this.list=list
	    	}
  		//点击3d隧道，因为3d隧道都没有children，现在点击3d隧道暂没有切换3d视图的功能，因为现在只有一个3d视图，点击其他都是提示‘此隧道暂没有3d视图’
		}else{
			let arr=this.list;
			for(let i=0,l=arr.length;i<l;i++){
				arr[i].active=false
			}
			arr[indx].active=true
			this.lis=arr;
			this.num3d=indx
		}
    	
    }
  },
  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.videoVue{display: flex;justify-content: flex-start;align-items: flex-start;}
/*list*/
.listpre{padding: 3px 0 3px 5px;cursor: pointer;}
.listpre:hover{background-color: #eef0f3;}
.left{width:250px;padding:0 5px 10px 10px;border-right: 1px solid #eee;border-bottom: 1px solid #eee;overflow: scroll;
	box-sizing: border-box;margin-right: 5px;}
.list{overflow-y: scroll;overflow-x: auto;}
::-webkit-scrollbar{display: none;}
.listpretxt{font-size: 14px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;flex: 10;text-align: left;color: #606266;}
.righticon{width: 9px;overflow: hidden;margin-right: 2px;transition: all 0.3s linear;}
.itemsontxt{color: #606266;font-size: 14px;padding: 0 0 0 35px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;cursor: pointer;
	height: 0;opacity: 0;transition: all 0.3s linear;text-align: left;}
.itemsontxtactive{background-color: #eef0f3;}

.itemsontxtno{color: rgba(144,147,153,0.5);}
.itemsontxtwarn{color:rgb(230, 162, 60,0.6) ;}
#videocont .itemsontxtxiala{height: 25px;line-height: 25px;opacity: 1;}
#videocont .righticonxiala{transform: rotate(90deg);}
.itemsontxt:hover{background-color: #eef0f3;}
/*list*/
.right{width: 100%;position: relative;}
.select{border: 1px solid #eee;width: 200px;padding: 0 10px;box-sizing: border-box;}
#videobox{width: 100%;height:100%;}
.loading{position: absolute;top: 50%;left: 50%;transform: translateX(-50%) translateY(-50%);width: 45px;}
.errorTip{position: absolute;top: 50%;left: 50%;transform: translateX(-50%) translateY(-50%);padding: 15px 30px;background: #EEEEEE;border-radius: 6px;}
.loading img{width: 100%;}
.width{width: 0;}
</style>
