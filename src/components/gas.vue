<template>
	<div class="gascont">
		<div class="left " :style="'height:'+height">
			<div class="select flexl">
				<el-radio v-model="radio" label="1">隧道名称</el-radio>
			</div>
			<div v-for="(item,indx) in list" class="listitempre" :class="item.isactive?'itemsontxtactive':''" @click="changeTunnel(indx)">
				<div class="listitem">{{item.name}}</div>
			</div>
		</div>
		<div class="right">
			<div class="road">
				<div class="flexa pillarpre">
					<div class="flexl jiantleft">
						<div class="jiantimg fleximg"><img src="../assets/jiant.png"/> </div>
						<div class="jianttxt">进口</div>
					</div>
					<div class="flexl jiantright">
						<div class="jiantimg fleximg"><img src="../assets/jiant.png"/> </div>
						<div class="jianttxt">出口</div>
					</div>
				</div>
				<div class="roadup">
					<div class="yellowline"></div>
					<div class="yellowline"></div>
					<div class="content">
						<div class="wall"></div>
						<div class="diged">
							<div class="digedtxtleft">↑二衬↓</div>
							<div class="cavetxtleft">↑洞口↓</div>
							<div class="rightt" style="width: 55%;">
								<div class="gas flexl" v-for="(item,index) in gasdata.in.left.ec">
									<div class="gasname" :class="[item.typeName=='CH₄'?'ch4':'',item.typeName=='H₂S'?'h2s':'',item.typeName=='CO'?'co':'',item.typeName=='CO₂'?'co2':'',item.typeName=='O₂'?'o2':'',item.warn?'warn':'']">
										{{item.typeName}}
									</div>
									<div class="gasvalue">{{item.value}}({{item.unit}})</div>
									<div class="typenamehv" :class="[item.typeName=='CH₄'?'ch4':'',item.typeName=='H₂S'?'h2s':'',item.typeName=='CO₂'?'co2':'',item.typeName=='CO'?'co':'',item.typeName=='O₂'?'o2':'']">
										<div>设备名称：{{item.name}}</div>
										<div>当前值：{{item.value}}({{item.unit}})</div>
										<div>位置：{{item.address}}</div>
									</div>
								</div>
							</div>
							<div class="leftt" style="width: 30%;">
								<div class="gas flexl" v-for="(item,index) in gasdata.in.left.dk">
									<div class="gasname" :class="[item.typeName=='CH₄'?'ch4':'',item.typeName=='H₂S'?'h2s':'',item.typeName=='CO'?'co':'',item.typeName=='CO₂'?'co2':'',item.typeName=='O₂'?'o2':'',item.warn?'warn':'']">{{item.typeName}}</div>
									<div class="gasvalue">{{item.value}}({{item.unit}})</div>
									<div class="typenamehv" :class="[item.typeName=='CH₄'?'ch4':'',item.typeName=='H₂S'?'h2s':'',item.typeName=='CO₂'?'co2':'',item.typeName=='CO'?'co':'',item.typeName=='O₂'?'o2':'']">
										<div>设备名称：{{item.name}}</div>
										<div>当前值：{{item.value}}({{item.unit}})</div>
										<div>位置：{{item.address}}</div>
									</div>
								</div>
							</div>
							
						</div>
						<div class="tunnelface ">
							<div class="tunnelfacetxtleft">↑掌子面↓</div>
							<div class="leftt">
								<div class="gas flexl" v-for="(item,index) in gasdata.in.left.zzm">
									<div class="gasname" :class="[item.typeName=='CH₄'?'ch4':'',item.typeName=='H₂S'?'h2s':'',item.typeName=='CO₂'?'co2':'',item.typeName=='CO'?'co':'',item.typeName=='O₂'?'o2':'',item.warn?'warn':'']">{{item.typeName}}</div>
									<div class="gasvalue">{{item.value}}({{item.unit}})</div>
									<div class="typenamehv" :class="[item.typeName=='CH₄'?'ch4':'',item.typeName=='H₂S'?'h2s':'',item.typeName=='CO₂'?'co2':'',item.typeName=='CO'?'co':'',item.typeName=='O₂'?'o2':'']">
										<div>设备名称：{{item.name}}</div>
										<div>当前值：{{item.value}}({{item.unit}})</div>
										<div>位置：{{item.address}}</div>
									</div>
								</div>

							</div>
							
						</div>
						<div class="undig">
							<div class="undigtxt">未开挖区域</div>
						</div>
						<div class="tunnelface">
							<div class="tunnelfacetxtright">↑掌子面↓</div>
							<div class="leftt">
								<div class="gas flexl" v-for="(item,index) in gasdata.out.left.zzm">
									<div class="gasname" :class="[item.typeName=='CH₄'?'ch4':'',item.typeName=='H₂S'?'h2s':'',item.typeName=='CO₂'?'co2':'',item.typeName=='CO'?'co':'',item.typeName=='O₂'?'o2':'',item.warn?'warn':'']">{{item.typeName}}</div>
									<div class="gasvalue">{{item.value}}({{item.unit}})</div>
									<div class="typenamehv" :class="[item.typeName=='CH₄'?'ch4':'',item.typeName=='H₂S'?'h2s':'',item.typeName=='CO₂'?'co2':'',item.typeName=='CO'?'co':'',item.typeName=='O₂'?'o2':'']">
										<div>设备名称：{{item.name}}</div>
										<div>当前值：{{item.value}}({{item.unit}})</div>
										<div>位置：{{item.address}}</div>
									</div>
								</div>

							</div>
						</div>
						<div class="diged">
							<div class="digedtxtright">↑ 二衬  ↓</div>
							<div class="cavetxtright">↑洞口↓</div>
							<div class="leftt" style="width: 55%;">
								<div class="gas flexl" v-for="(item,index) in gasdata.out.left.ec">
									<div class="gasname" :class="[item.typeName=='CH₄'?'ch4':'',item.typeName=='H₂S'?'h2s':'',item.typeName=='CO'?'co':'',item.typeName=='CO₂'?'co2':'',item.typeName=='O₂'?'o2':'',item.warn?'warn':'']">
										{{item.typeName}}
									</div>
									<div class="gasvalue">{{item.value}}({{item.unit}})</div>
									<div class="typenamehv" :class="[item.typeName=='CH₄'?'ch4':'',item.typeName=='H₂S'?'h2s':'',item.typeName=='CO₂'?'co2':'',item.typeName=='CO'?'co':'',item.typeName=='O₂'?'o2':'']">
										<div>设备名称：{{item.name}}</div>
										<div>当前值：{{item.value}}({{item.unit}})</div>
										<div>位置：{{item.address}}</div>
									</div>
								</div>
							</div>
							<div class="rightt" style="width: 30%;">
								<div class="gas flexl" v-for="(item,index) in gasdata.out.left.dk">
									<div class="gasname" :class="[item.typeName=='CH₄'?'ch4':'',item.typeName=='H₂S'?'h2s':'',item.typeName=='CO'?'co':'',item.typeName=='CO₂'?'co2':'',item.typeName=='O₂'?'o2':'',item.warn?'warn':'']">{{item.typeName}}</div>
									<div class="gasvalue">{{item.value}}({{item.unit}})</div>
									<div class="typenamehv" :class="[item.typeName=='CH₄'?'ch4':'',item.typeName=='H₂S'?'h2s':'',item.typeName=='CO₂'?'co2':'',item.typeName=='CO'?'co':'',item.typeName=='O₂'?'o2':'']">
										<div>设备名称：{{item.name}}</div>
										<div>当前值：{{item.value}}({{item.unit}})</div>
										<div>位置：{{item.address}}</div>
									</div>
								</div>
							</div>
						</div>
						<div class="wall"></div>
					</div>
					<div class="holeleft">左洞</div>
					<div class="holeright">左洞</div>
				</div>
				<div class="flexa pillarpre">

					<div class="pillarleft"></div>
					<div class="pillarright"></div>

				</div>
				<div class="roadup">
					<div class="yellowline"></div>
					<div class="yellowline"></div>
					<div class="content">
						<div class="wall"></div>
						<div class="diged">
							<div class="rightt" style="width: 55%;">
								<div class="gas flexl" v-for="(item,index) in gasdata.in.right.ec">
									<div class="gasname" :class="[item.typeName=='CH₄'?'ch4':'',item.typeName=='H₂S'?'h2s':'',item.typeName=='CO'?'co':'',item.typeName=='CO₂'?'co2':'',item.typeName=='O₂'?'o2':'',item.warn?'warn':'']">
										{{item.typeName}}
									</div>
									<div class="gasvalue">{{item.value}}({{item.unit}})</div>
									<div class="typenamehv" :class="[item.typeName=='CH₄'?'ch4':'',item.typeName=='H₂S'?'h2s':'',item.typeName=='CO₂'?'co2':'',item.typeName=='CO'?'co':'',item.typeName=='O₂'?'o2':'']">
										<div>设备名称：{{item.name}}</div>
										<div>当前值：{{item.value}}({{item.unit}})</div>
										<div>位置：{{item.address}}</div>
									</div>
								</div>
							</div>
							<div class="leftt" style="width: 30%;">
								<div class="gas flexl" v-for="(item,index) in gasdata.in.right.dk">
									<div class="gasname" :class="[item.typeName=='CH₄'?'ch4':'',item.typeName=='H₂S'?'h2s':'',item.typeName=='CO'?'co':'',item.typeName=='CO₂'?'co2':'',item.typeName=='O₂'?'o2':'',item.warn?'warn':'']">{{item.typeName}}</div>
									<div class="gasvalue">{{item.value}}({{item.unit}})</div>
									<div class="typenamehv" :class="[item.typeName=='CH₄'?'ch4':'',item.typeName=='H₂S'?'h2s':'',item.typeName=='CO₂'?'co2':'',item.typeName=='CO'?'co':'',item.typeName=='O₂'?'o2':'']">
										<div>设备名称：{{item.name}}</div>
										<div>当前值：{{item.value}}({{item.unit}})</div>
										<div>位置：{{item.address}}</div>
									</div>
								</div>
							</div>
						</div>
						<div class="tunnelface">
							<!--<div class="tunnelfacetxtleft">掌子面</div>-->
							<div class="leftt">
								<div class="gas flexl" v-for="(item,index) in gasdata.in.right.zzm">
									<div class="gasname" :class="[item.typeName=='CH₄'?'ch4':'',item.typeName=='H₂S'?'h2s':'',item.typeName=='CO₂'?'co2':'',item.typeName=='CO'?'co':'',item.typeName=='O₂'?'o2':'',item.warn?'warn':'']">{{item.typeName}}</div>
									<div class="gasvalue">{{item.value}}({{item.unit}})</div>
									<div class="typenamehv" :class="[item.typeName=='CH₄'?'ch4':'',item.typeName=='H₂S'?'h2s':'',item.typeName=='CO₂'?'co2':'',item.typeName=='CO'?'co':'',item.typeName=='O₂'?'o2':'']">
										<div>设备名称：{{item.name}}</div>
										<div>当前值：{{item.value}}({{item.unit}})</div>
										<div>位置：{{item.address}}</div>
									</div>
								</div>
							</div>
						</div>
						<div class="undig">
							<div class="undigtxt">未开挖区域</div>
						</div>
						<div class="tunnelface">
							<!--<div class="tunnelfacetxtright">掌子面</div>-->
							<div class="leftt">
								<div class="gas flexl" v-for="(item,index) in gasdata.out.right.zzm">
									<div class="gasname" :class="[item.typeName=='CH₄'?'ch4':'',item.typeName=='H₂S'?'h2s':'',item.typeName=='CO₂'?'co2':'',item.typeName=='CO'?'co':'',item.typeName=='O₂'?'o2':'',item.warn?'warn':'']">{{item.typeName}}</div>
									<div class="gasvalue">{{item.value}}({{item.unit}})</div>
									<div class="typenamehv" :class="[item.typeName=='CH₄'?'ch4':'',item.typeName=='H₂S'?'h2s':'',item.typeName=='CO₂'?'co2':'',item.typeName=='CO'?'co':'',item.typeName=='O₂'?'o2':'']">
										<div>设备名称：{{item.name}}</div>
										<div>当前值：{{item.value}}({{item.unit}})</div>
										<div>位置：{{item.address}}</div>
									</div>
								</div>

							</div>
						</div>
						<div class="diged">
							<!--<div class="digedtxtright">二衬</div>-->
							<div class="leftt" style="width: 55%;">
								<div class="gas flexl" v-for="(item,index) in gasdata.out.right.ec">
									<div class="gasname" :class="[item.typeName=='CH₄'?'ch4':'',item.typeName=='H₂S'?'h2s':'',item.typeName=='CO'?'co':'',item.typeName=='CO₂'?'co2':'',item.typeName=='O₂'?'o2':'',item.warn?'warn':'']">
										{{item.typeName}}
									</div>
									<div class="gasvalue">{{item.value}}({{item.unit}})</div>
									<div class="typenamehv" :class="[item.typeName=='CH₄'?'ch4':'',item.typeName=='H₂S'?'h2s':'',item.typeName=='CO₂'?'co2':'',item.typeName=='CO'?'co':'',item.typeName=='O₂'?'o2':'']">
										<div>设备名称：{{item.name}}</div>
										<div>当前值：{{item.value}}({{item.unit}})</div>
										<div>位置：{{item.address}}</div>
									</div>
								</div>
							</div>
							<div class="rightt" style="width: 30%;">
								<div class="gas flexl" v-for="(item,index) in gasdata.out.right.dk">
									<div class="gasname" :class="[item.typeName=='CH₄'?'ch4':'',item.typeName=='H₂S'?'h2s':'',item.typeName=='CO'?'co':'',item.typeName=='CO₂'?'co2':'',item.typeName=='O₂'?'o2':'',item.warn?'warn':'']">{{item.typeName}}</div>
									<div class="gasvalue">{{item.value}}({{item.unit}})</div>
									<div class="typenamehv" :class="[item.typeName=='CH₄'?'ch4':'',item.typeName=='H₂S'?'h2s':'',item.typeName=='CO₂'?'co2':'',item.typeName=='CO'?'co':'',item.typeName=='O₂'?'o2':'']">
										<div>设备名称：{{item.name}}</div>
										<div>当前值：{{item.value}}({{item.unit}})</div>
										<div>位置：{{item.address}}</div>
									</div>
								</div>
							</div>
						
						</div>
						<div class="wall"></div>
					</div>
					<div class="holeleft">右洞</div>
					<div class="holeright">右洞</div>
				</div>
				<div class="pillarpre">
					<div class="flexl jiantleft">
						<div class="jiantimg fleximg"><img src="../assets/jiant.png"/> </div>
						<div class="jianttxt">进口</div>
					</div>
					<div class="flexl jiantright">
						<div class="jiantimg fleximg"><img src="../assets/jiant.png"/> </div>
						<div class="jianttxt">出口</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'Home',
		data() {
			return {
				list:[],//左边隧道列表
				height:'',//页面高度
				radio: '1',//左边顶部radio选中1
				gasdata:[],//页面右边气体数据
				num:0
			}
		},
		methods: {
			//获取常规标段列表
			getnormlist() {
				let that = this
				this.$http.post(that.global.domainurl + '/jeecg-boot/replace/getBidsectionListByTypeAndBelong ', {
					username: that.UrlSearch(),
					identify: 'nomal',
					menu: '有害气体'
				}).then(res => {
					if(res.data.code === 200) {
						let arr = res.data.result;
						//给常规list下每一项添加isactive=false，开始都没有选中，isactive=true当前项选中
						for(let i = 0, l = arr.length; i < l; i++) {arr[i].isactive = false}
						arr[that.num].isactive = true;
						that.getGasData(res.data.result[that.num].id)
						that.list = arr
						//存入内存，下次点击切换先查看内存中是否有，没有才请求接口获取
						localStorage.setItem("listnormGas", JSON.stringify(arr));
						return arr
					}
				}).catch(function(error) {
					console.log(error)
				})
			},
			getGasData(id){
				let that = this
				this.fullscreenLoading = true;
				this.$http.post(that.global.domainurl + '/jeecg-boot/replace/getHarmfulGas', {
					bidsectionId:id
				}).then(res => {
					this.fullscreenLoading = false;
					console.log(res)
					if(res.data.code === 200) {
						that.gasdata=res.data.result
					}
				}).catch(function(error) {
					this.fullscreenLoading = false;
					console.log(error)
				})
			},
			//获取页面高度
//			videoHeight() {
//			  	this.$nextTick(()=>{
//					this.height=window.innerHeight
//			  	})
//			},
			//点击切换隧道切换右边气体数据
			changeTunnel(index){
				console.log(index);
				let that=this;
				let list=JSON.parse(JSON.stringify(that.list))
				let num=JSON.parse(JSON.stringify(that.num))
				list[num].isactive=false;
				list[index].isactive=true;
				this.list=list;
				this.num=index;
				this.getGasData(list[index].id)
			},
			//获取页面路径传过来的username
			UrlSearch(){
//		        let url = window.location.href;
		        let url='http://kaijin.zhoumc.cn/dist/#/envir?username=admin'
		        let m=url.split('?')[1].split('&')
		        let obj={}
		        for(let i=0;i<m.length;i++){
		          let a=m[i].split('=')
		          obj[a[0]]=a[1]
		        }
		        return obj.username
		    },
		},
		mounted() {
			//执行下面的函数
			this.list = this.getnormlist();
			this.height=(document.documentElement.clientHeight).toFixed(2)+'px';
		},
		created() {
			let that=this;
	        window.addEventListener('resize', function(){
				that.height=(document.documentElement.clientHeight).toFixed(2)+'px';
	        });
		},
		destroyed() {
			let that=this;
		    window.removeEventListener('resize', function(){
				that.height=(document.documentElement.clientHeight).toFixed(2)+'px';
		    })
		}
	}
</script>

<style scoped>
	.gascont{display: flex;justify-content: flex-start;align-items: flex-start;}
	.left{width: 240px;border-right: 1px solid #eee;}
	.select {border: 1px solid #eee;text-align: left;padding: 0 10px;box-sizing: border-box;height: 28px;}
	.listitempre{padding: 2px 0 2px 30px;}
	.listitempre:hover {background-color: #eef0f3;}
	.listitem{font-size: 14px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;text-align: left;color: #606266;}
	.itemsontxtactive {background-color: #eef0f3;}
	
	
	/*隧道*/
	.right{width: 100%;}
	.road{}
	.roadup{width: 100%;height: 180px;background: rgba(0,0,0,0.5);display: flex;flex-wrap: wrap;align-content: center;
		justify-content:center;position: relative;}
	.yellowline{width: 100%;height: 3px;margin: 3px 0;background: #E0B33A;}
	.holeleft{color: #FEFEFE;font-size: 30px;position: absolute;bottom: 6%;left: 4%;}
	.holeright{color: #FEFEFE;font-size: 30px; position: absolute;bottom: 6%;right: 4%;}
	.content{position: absolute;top: 0;left: 50%;height: 100%;width: 90%;transform: translateX(-50%);display: flex;justify-content: center;align-items: center;}
	.wall{background: url(../assets/wall.jpg) repeat;width: 14px;height: 100%;}
	.diged{background:linear-gradient(top, #ADACAD 0%, #FDFDFF 35%,#FDFDFF 60%,#ADACAD 100%);height: 100%;width: 30%;position: relative;}
	.digedtxtleft{font-size: 20px;font-weight: bold; color: #DD8200;width: 20px;position: absolute;right: 6%;bottom: -145px;transform: translateY(-50%);}
	.digedtxtright{font-size: 20px;font-weight: bold;color: #DD8200;width: 20px;position: absolute;left: 6%;bottom: -145px;transform: translateY(-50%);}
	.cavetxtleft{font-size: 20px;font-weight: bold; color: #DD8200;width: 20px;position: absolute;left: 6%;bottom: -145px;transform: translateY(-50%);}
	.cavetxtright{font-size: 20px;font-weight: bold; color: #DD8200;width: 20px;position: absolute;right: 6%;bottom: -145px;transform: translateY(-50%);}
	.tunnelface{background: url(../assets/grid1.png) repeat;width: 8%;height: 100%; background-color: white;position: relative;}
	.tunnelfacetxtleft{font-size: 16px;font-weight: bold;color: #D77F00;width: 20px;position: absolute;left: 50%;bottom: -100px;transform: translateX(-50%);}
	.tunnelfacetxtright{font-size: 16px;font-weight: bold;color: #D77F00;width: 20px;position: absolute;left: 50%;bottom: -100px;transform: translateX(-50%);}
	.undig{background: url(../assets/undig.jpg) repeat;;width: 12%;height: 100%;position: relative;}
	.undigtxt{font-size: 20px;color: #FEFEFE;width: 30px;position: absolute;left: 50%;top: 50%;transform: translateY(-50%) translateX(-50%);}
	.pillarpre{position: relative;height: 100px;}
	.pillarleft{width: 6%;height:100px;background: url(../assets/pillar.jpg) repeat;}
	.pillarright{width: 6%;height:100px;background: url(../assets/pillar.jpg) repeat;}
	.jiantimg{width: 40px;margin-right: 10px;}
	.jianttxt{font-size: 20px;color: #E0B33A;}
	.jiantleft{position: absolute;top: 50%;left: 0%;transform: translateY(-50%);}
	.jiantright{position: absolute;top: 50%;right: 0%;transform: translateY(-50%);}
	/*隧道*/
	
	
	.gasname{font-size: 12px;width: 20px;height: 20px;line-height: 20px; background: #F56C6C;color: #FFFFFF;padding: 5px;border-radius: 50%;
		transform: scale(0.8);}
	.typenamehv{background: #FFFFFF; position: absolute;top: 40px;left: 0;display: none;color: #FFFFFF;width: 180px;z-index: 9;text-align: left;
		padding: 5px;border-radius: 8px;font-size: 14px}
	.gasvalue{font-size: 12px;}
	.gas{background: #ffffff;border-radius: 10px;margin: 2px 4px;padding: 0 3px;border: 1px solid #ddd;position: relative;}
	.gas:hover .typenamehv{display: block;}
	.gas:hover .gasname{transform: scale(0.9);}
	.leftt{position: absolute;top: 0;left: 0;display: flex;justify-content: flex-start;flex-wrap: wrap;align-content: flex-start;height: 100%;}
	.rightt{position: absolute;top: 0;right: 0;display: flex;justify-content: flex-end;flex-wrap: wrap;align-content: flex-start;height: 100%;}
	.ch4{background:#E69D87;}
	.co{background:#73A373;}
	.co2{background: #EA7E53;}
	.h2s{background: #8DC1A9;}
	.o2{background: #EEDD78;}
	.warn{animation: warnming 500ms infinite;}
	@keyframes warnming{
		0%{
			background: red;
		}
		50%{
			background: blue;
		}
		100%{
			background: red;
		}
	}
</style>