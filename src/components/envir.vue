<template>
	<div class="videoVue" id="videocont">
		<div class="left" :style="{height: height+'px'}">
			<div class="select flex">
				<el-radio v-model="radio" label="1" @change='selectchange'>常规列表</el-radio>
				<el-radio v-model="radio" label="2" @change='selectchange'>3D列表</el-radio>
			</div>
			<div id="list ">
				<div v-for="(item,indx) in list">
					<div class="listpre flexl" @click="handlelistpre(item,indx)" :class="item.active?'itemsontxtactive':''">
						<div class="fleximg" style="flex: 1;">
							<div v-if="item.children && item.children.length>0" class="righticon" :class="item.ispull?'righticonxiala':''">
								<img src="../assets/righticon.png" />
							</div>
						</div>
						<div class="listpretxt">{{item.name}}</div>
					</div>
					<div class="itemxiala" v-for="(itemson,index) in item.children" @click="handleNodeClick(itemson,indx,index)">
						<div class="itemsontxt" :class="[item.ispull?'itemsontxtxiala':'',itemson.state==='未知'?'itemsontxtwarn':'',itemson.state==='离线'?'itemsontxtno':'',itemson.isactive?'itemsontxtactive':'']">
							{{itemson.name}}
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="right" v-if="show3d">
			<iframe :src="list[num3d].vraddress" :height="height" allowfullscreen="true" allowtransparency="true" style="width: 100%;"></iframe>
		</div>
		<div class="right flexl" :class="show3d?'width':''">
			<div class="righttop flexl">
				<div class="righttopson " v-for="(item,indx) in righttop">{{item.name}}</div>
			</div>
			<div class="chartpre">
				<div style="width: 500px;" v-for="(itemson,index) in chartidlist">
					<div :id="chartidlist[index]" :style="{ height: '300px',width:'500px'}" :ref='chartidlist[index]'></div>
				</div>
			</div>

		</div>
	</div>
</template>
<script>
	export default {
		name: 'Video',
		data() {
			return {
				list: [],
				defaultProps: {
					children: 'children',
					label: 'name'
				},
				radio: '1',
				loadingshow: false, //加载中是否显示
				show3d: false, //3d页面是否显示
				height: '', //页面高度
				num3d: 0, //3d的选中项下标
				righttop: [], //chart数据
				chartlist: [],
				chartidlist: []
			}
		},
		mounted() {
			//执行下面的函数
			this.list = this.getnormlist();
			this.get3dlist()

		},
		beforeDestroy() {},
		created() {
			this.chartstart()
			window.removeEventListener('resize', this.videoHeight())
		},
		destroyed() {
			window.removeEventListener('resize', this.videoHeight())
		},
		methods: {
			//获取常规标段列表
			getnormlist() {
				let that = this
				this.$http.post(that.global.domainurl + '/jeecg-boot/replace/getBidsectionListByTypeAndBelong ', {
					username: 'admin',
					identify: 'nomal',
					menu: '环境监测'
				}).then(res => {
					if(res.data.code === 200) {
						let arr = res.data.result;
						//给常规list下每一项添加ispull=false，开始都没有下拉，ispull=true当前项下拉
						for(let i = 0, l = arr.length; i < l; i++) {
							arr[i].ispull = false
							if(arr[i].children.length > 0) {
								//给常规list下每一项的children添加isactive=false，isactive=true的时候是被选中的状态
								for(let j = 0, th = arr[i].children.length; j < th; j++) {
									arr[i].children[j].isactive = false
									if(arr[i].children[j].id === 'a0341955d5e77bbc56281a116d8752e1') {
										//默认有打开一个，默认项有下拉，默认项又被选中的状态,默认的这一项数据较多所以选这一项
										arr[i].ispull = true
										arr[i].children[j].isactive = true;
									}
								}
							}
						}
						that.list = arr
						//存入内存，下次点击切换先查看内存中是否有，没有才请求接口获取
						localStorage.setItem("listnormEnvir", JSON.stringify(arr));

						return arr
					}
				}).catch(function(error) {
					console.log(error)
				})
			},
			//获取3d标段列表
			get3dlist() {
				let that = this
				this.$http.post(that.global.domainurl + '/jeecg-boot/replace/getBidsectionListByTypeAndBelong ', {
					username: 'admin',
					identify: '3d',
					menu: '环境监测'
				}).then(res => {
					if(res.data.code === 200) {
						console.log(res.data.result)
						let arr = res.data.result;
						//3dlist里面默认每一项都没有选中，active=true为选中状态
						for(let i = 0, l = arr.length; i < l; i++) {
							arr[i].active = false
						}
						//因为当前只有一个3d示例，所以暂时列第一个为默认选中项
						arr[0].active = true;
						localStorage.setItem("list3d", JSON.stringify(arr));
						return arr
					}
				}).catch(function(error) {
					console.log(error)
				})
			},
			//radio==='2'为3d，'1'为常规默认
			selectchange() {
				let that = this;
				console.log(this.radio)
				if(this.radio === '2') {
					this.show3d = true
					//如果缓存中存在取缓存的list，没有久接口获取

					let list3d = localStorage.getItem("list3d")
					if(list3d) {
						this.list = JSON.parse(list3d)
						console.log(this.list)
					} else {
						this.list = this.get3dlist()
						console.log(this.list)
					}
				} else if(this.radio === '1') {
					this.show3d = false
					let listnorm = localStorage.getItem("listnormEnvir")
					if(listnorm) {
						this.list = JSON.parse(listnorm)
						console.log(this.list)
					} else {
						this.list = this.getnormlist()
						console.log(this.list)
					}

				}
				console.log(this.list)
			},
			//点击隧道下的节点，data参数为当前节点项的各种数据
			handleNodeClick(data, indx, index) {
				let arr = this.list,
					that = this;
				//让其他节点都为不active
				for(let i = 0, l = arr.length; i < l; i++) {
					if(arr[i].children.length > 0) {
						for(let j = 0, th = arr[i].children.length; j < th; j++) {
							arr[i].children[j].isactive = false
						}
					}
				}
				//设置点击的那个为active
				arr[indx].children[index].isactive = true
				this.list = arr;
				this.loadingshow = true;
				this.$http.post(that.global.domainurl + '/jeecg-boot/air/environmentalmonitoring', {
					engineeringId: data.id
				}).then(res => {
					console.log(res)
					this.loadingshow = false
					that.righttop = res.data.result
					if(res.data.code === 0) {
						for(let i = 0, l = res.data.result.length; i < l; i++) {

							console.log(that.righttop)

						}
					} else if(res.data.code === 500) {
						this.$message({
							showClose: true,
							message: res.data.message,
							type: 'error'
						});
					}
				}).catch(function(error) {
					console.log(error)
				})

			},
			videoHeight() {
				//  	this.$nextTick(()=>{
				//  		console.log(this.$refs.video)
				//			let vidoeWidth=this.$refs.video.clientWidth;
				//			this.$refs.video.style.height = vidoeWidth*0.54+'px';
				//			this.height=window.innerHeight
				//  	})

			},
			//点击隧道
			handlelistpre(item, indx) {
				console.log(item)
				//点击常规隧道项，因为常规隧道都没有children
				if(item.children) {
					//				this.show3d=false
					if(item.children.length === 0) {
						this.$message({
							showClose: true,
							message: '此工地咱无视频监控'
						});
					} else if(item.children.length > 0) {
						let list = this.list
						list[indx].ispull = !list[indx].ispull
						localStorage.setItem("listnorm", JSON.stringify(list));
						this.list = list
					}
					//点击3d隧道，因为3d隧道都没有children，现在点击3d隧道暂没有切换3d视图的功能，因为现在只有一个3d视图，点击其他都是提示‘此隧道暂没有3d视图’
				} else {
					let arr = this.list;
					for(let i = 0, l = arr.length; i < l; i++) {
						arr[i].active = false
					}
					arr[indx].active = true
					this.lis = arr;
					this.num3d = indx
				}

			},
			// 	获取初始有多少个chart,获取chart初始数据，默认展示b1鸡鸣隧道出口的第一个（出口值班室） 的数据
			chartstart() {
				let that = this;

				that.$http.post(that.global.domainurl + '/jeecg-boot/air/environmentalmonitoring ', {
					engineeringId: 'a0341955d5e77bbc56281a116d8752e1'
				}).then(res => {
					console.log(res)
					this.righttop = res.data.result;
					let chartidlist = this.chartidlist;
					console.log(res.data.result[0].values.length)
					for(let i = 0, n = res.data.result[0].values.length; i < n; i++) {
						console.log(1)
						var name = "myChart" + i; //生成函数名						
						chartidlist.push("myChart" + i)
					}
					//这一步确定有多少个chart
					that.chartidlist = chartidlist
					that.$nextTick(() => {
						that.drawLine();
//						let myChart0 = this.$echarts.init(document.getElementById("myChart0"));
//						let myChart1 = this.$echarts.init(document.getElementById("myChart1"));
//						let myChart2 = this.$echarts.init(document.getElementById("myChart2"));
//						let myChart3 = this.$echarts.init(document.getElementById("myChart3"));
//						let myChart4 = this.$echarts.init(document.getElementById("myChart4"));
//						let myChart5 = this.$echarts.init(document.getElementById("myChart5"));
//						let myChart6 = this.$echarts.init(document.getElementById("myChart6"));
						console.log(chartidlist)
						//默认进来先进入鸡鸣隧道出口的第一个（出口值班室） 的数据，所以是res.data.result[0]，注意以后会不会更改
						for(let i = 0, l = res.data.result[0].values.length; i < l; i++) {
							let name = "myChart" + i; //生成函数名
							window[name]=that.$echarts.init(document.getElementById("myChart"+i));
							window[name].showLoading();
							that.$http.post(that.global.domainurl + '/jeecg-boot/air/dayline ', {
								date: "2019-11-28",
								equipmentId:res.data.result[0].values[i].equipment_id ,
								typeId: res.data.result[0].values[i].type_id
							}).then(resson => {
								console.log(res)
								window[name].hideLoading();
								window[name].setOption({
									legend: {
										data: [ res.data.result[0].values[i].typeName+'('+resson.data.result.unit+')']
									},
									series: [{
										// 根据名字对应到相应的系列
										name: res.data.result[0].values[i].typeName+'('+resson.data.result.unit+')',
										data: resson.data.result.valueList
									}]
								});
							})
						}

					})
				})
			},
			//初始化各个chart
			drawLine() {
				// 基于准备好的dom，初始化echarts实例
				if(this.$refs.myChart0) {
					let myChart0 = this.$echarts.init(document.getElementById("myChart0"));
					myChart0.setOption({
						tooltip: {
							trigger: 'axis',
							axisPointer: {
								type: 'cross',
								crossStyle: {
									color: '#999'
								}
							}
						},
						xAxis: {
							type: 'category',
							data: ['0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00']
						},
						yAxis: {
							type: 'value',

						},
						series: [{
							data: [],
							type: 'line',
							smooth: true,
							name: '',
						}]
					});

				}
				if(this.$refs.myChart1) {
					let myChart1 = this.$echarts.init(document.getElementById("myChart1"));
					myChart1.setOption({
						tooltip: {
							trigger: 'axis',
							axisPointer: {
								type: 'cross',
								crossStyle: {
									color: '#999'
								}
							}
						},
						xAxis: {
							type: 'category',
							data: ['0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00']
						},
						yAxis: {
							type: 'value',

						},
						series: [{
							data: [],
							type: 'line',
							smooth: true,
							name: '',
						}]
					});
				}
				if(this.$refs.myChart2) {
					let myChart2 = this.$echarts.init(document.getElementById("myChart2"));
					myChart2.setOption({
						tooltip: {
							trigger: 'axis',
							axisPointer: {
								type: 'cross',
								crossStyle: {
									color: '#999'
								}
							}
						},
						xAxis: {
							type: 'category',
							data: ['0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00']
						},
						yAxis: {
							type: 'value',

						},
						series: [{
							data: [],
							type: 'line',
							smooth: true,
							name: '',
						}]
					});
				}
				if(this.$refs.myChart3) {
					let myChart3 = this.$echarts.init(document.getElementById("myChart3"));
					myChart3.setOption({
						tooltip: {
							trigger: 'axis',
							axisPointer: {
								type: 'cross',
								crossStyle: {
									color: '#999'
								}
							}
						},
						xAxis: {
							type: 'category',
							data: ['0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00']
						},
						yAxis: {
							type: 'value',

						},
						series: [{
							data: [],
							type: 'line',
							smooth: true,
							name: '',
						}]
					});
				}
				if(this.$refs.myChart4) {
					let myChart4 = this.$echarts.init(document.getElementById("myChart4"));
					myChart4.setOption({
						tooltip: {
							trigger: 'axis',
							axisPointer: {
								type: 'cross',
								crossStyle: {
									color: '#999'
								}
							}
						},
						xAxis: {
							type: 'category',
							data: ['0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00']
						},
						yAxis: {
							type: 'value',

						},
						series: [{
							data: [],
							type: 'line',
							smooth: true,
							name: '',
						}]
					});
				}
				if(this.$refs.myChart5) {
					let myChart5 = this.$echarts.init(document.getElementById("myChart5"));
					myChart5.setOption({
						tooltip: {
							trigger: 'axis',
							axisPointer: {
								type: 'cross',
								crossStyle: {
									color: '#999'
								}
							}
						},
						xAxis: {
							type: 'category',
							data: ['0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00']
						},
						yAxis: {
							type: 'value',

						},
						series: [{
							data: [],
							type: 'line',
							smooth: true,
							name: '',
						}]
					});
				}
				if(this.$refs.myChart6) {
					let myChart6 = this.$echarts.init(document.getElementById("myChart6"));
					myChart6.setOption({
						tooltip: {
							trigger: 'axis',
							axisPointer: {
								type: 'cross',
								crossStyle: {
									color: '#999'
								}
							}
						},
						xAxis: {
							type: 'category',
							data: ['0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00']
						},
						yAxis: {
							type: 'value',

						},
						series: [{
							data: [],
							type: 'line',
							smooth: true,
							name: '',
						}]
					});

				}
				if(this.$refs.myChart7) {
					let myChart7 = this.$echarts.init(document.getElementById("myChart7"));
					myChart7.setOption({
						tooltip: {
							trigger: 'axis',
							axisPointer: {
								type: 'cross',
								crossStyle: {
									color: '#999'
								}
							}
						},
						xAxis: {
							type: 'category',
							data: ['0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00']
						},
						yAxis: {
							type: 'value',

						},
						series: [{
							data: [],
							type: 'line',
							smooth: true,
							name: '',
						}]
					});
				}
				if(this.$refs.myChart8) {
					let myChart8 = this.$echarts.init(document.getElementById("myChart8"));
					myChart8.setOption({
						tooltip: {
							trigger: 'axis',
							axisPointer: {
								type: 'cross',
								crossStyle: {
									color: '#999'
								}
							}
						},
						xAxis: {
							type: 'category',
							data: ['0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00']
						},
						yAxis: {
							type: 'value',

						},
						series: [{
							data: [],
							type: 'line',
							smooth: true,
							name: '',
						}]
					});
				}
				if(this.$refs.myChart9) {
					let myChart9 = this.$echarts.init(document.getElementById("myChart9"));
					myChart9.setOption({
						tooltip: {
							trigger: 'axis',
							axisPointer: {
								type: 'cross',
								crossStyle: {
									color: '#999'
								}
							}
						},
						xAxis: {
							type: 'category',
							data: ['0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00']
						},
						yAxis: {
							type: 'value',

						},
						series: [{
							data: [],
							type: 'line',
							smooth: true,
							name: '',
						}]
					});
				}

			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	div {
		padding: 0 rem(30);
		position: relative;
	}
	
	#myChart {
		border-bottom: rem(1) solid $line_color;
	}
	
	.title {
		position: absolute;
		left: 44%;
		top: 29%;
		font-size: rem(30);
	}
	
	.percent1 {
		position: absolute;
		left: 10%;
		top: 35%;
		font-size: rem(32);
		color: #333;
		font-weight: bold;
		line-height: rem(55);
	}
	
	.percent2 {
		position: absolute;
		right: 10%;
		top: 35%;
		font-size: rem(32);
		color: #333;
		font-weight: bold;
		line-height: rem(55);
	}
	
	.time {
		position: absolute;
		left: 24%;
		top: 70%;
	}
	
	.videoVue {
		display: flex;
		justify-content: flex-start;
		align-items: flex-start;
	}
	/*list*/
	
	.listpre {
		padding: 3px 0 3px 5px;
		cursor: pointer;
	}
	
	.listpre:hover {
		background-color: #F5F7FA;
	}
	
	.left {
		width: 250px;
		padding: 0 5px 10px 10px;
		border-right: 1px solid #eee;
		border-bottom: 1px solid #eee;
		overflow: scroll;
		box-sizing: border-box;
		margin-right: 5px;
	}
	
	.list {
		overflow-y: scroll;
		overflow-x: auto;
	}
	
	::-webkit-scrollbar {
		display: none;
	}
	
	.listpretxt {
		font-size: 14px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		flex: 10;
		text-align: left;
		color: #606266;
	}
	
	.righticon {
		width: 9px;
		overflow: hidden;
		margin-right: 2px;
		transition: all 0.3s linear;
	}
	
	.itemsontxt {
		color: #606266;
		font-size: 14px;
		padding: 0 0 0 35px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		cursor: pointer;
		height: 0;
		opacity: 0;
		transition: all 0.3s linear;
	}
	
	.itemsontxtactive {
		background-color: #F5F7FA;
	}
	
	.itemsontxtno {
		color: rgba(144, 147, 153, 0.5);
	}
	
	.itemsontxtwarn {
		color: rgb(230, 162, 60, 0.6);
	}
	
	#videocont .itemsontxtxiala {
		height: 25px;
		line-height: 25px;
		opacity: 1;
	}
	
	#videocont .righticonxiala {
		transform: rotate(90deg);
	}
	
	.itemsontxt:hover {
		background-color: #F5F7FA;
	}
	/*list*/
	
	.right {
		width: 100%;
		position: relative;
		overflow: hidden;
	}
	
	.select {
		border: 1px solid #eee;
		width: 200px;
		padding: 0 10px;
		box-sizing: border-box;
	}
	
	#videobox {
		width: 100%;
		height: 100%;
	}
	
	.loading {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translateX(-50%) translateY(-50%);
		width: 45px;
	}
	
	.errorTip {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translateX(-50%) translateY(-50%);
		padding: 15px 30px;
		background: #EEEEEE;
		border-radius: 6px;
	}
	
	.loading img {
		width: 100%;
	}
	
	.width {
		width: 0;
	}
	
	.chartpre {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-start;
		align-content: flex-start;
		margin-top: 100px;
	}
	
	.righttop {
		position: absolute;
		top: 20px;
		left: 0;
	}
	
	.righttopson {
		background: rgba(64, 158, 255, 0.8);
		padding: 10px 20px;
		border-radius: 10px;
		color: #FFFFFF;
		font-size: 16px;
		font-weight: bold;
		margin-left: 100px;
	}
</style>