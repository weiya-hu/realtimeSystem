<template>
	<div class="videoVue" id="envircont">
		<div class="left" :style="'height:'+height">
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
		<div class="right" :class="show3d?'width':''" :style="'height:'+height">
			<div class="righttop flexl">
				<div class="righttopson " :class="indx==num?'righttopsonactive':''" v-for="(item,indx) in righttop" @click="changeRightTop(item,indx)">{{item.name}}</div>
			</div>
			<div class="chartpre">
				<div class="chartitem" style="width: 650px;" v-for="(itemson,index) in chartidlist">
					<div :id="chartidlist[index]" :style="{ height: '300px',width:'700px'}" :ref='chartidlist[index]'></div>
					<el-date-picker value-format='yyyy-MM-dd'  v-model="values[index]" align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions" class='datepicker' @change='datechange(itemson,index)'></el-date-picker>
					<div class="datenodata" v-if="isnodata[index]">当前所选择日期暂无数据</div>
					<div class="current">
						当前值：{{res.data.result[num].values[index].value}} {{res.data.result[num].values[index].unit=='无'?'':res.data.result[num].values[index].unit}}
					</div>
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
				num:0,
				chartidlist: [],
				pickerOptions: {
					disabledDate(time) {
						return time.getTime() > Date.now();
					},
					shortcuts: [{
						text: '今天',
						onClick(picker) {
							picker.$emit('pick', new Date());
						}
					}, {
						text: '昨天',
						onClick(picker) {
							const date = new Date();
							date.setTime(date.getTime() - 3600 * 1000 * 24);
							picker.$emit('pick', date);
						}
					}, {
						text: '一周前',
						onClick(picker) {
							const date = new Date();
							date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
							picker.$emit('pick', date);
						}
					}]
				},
				values: [],//各个chart的日期
				isnodata:[],//每个chart是否显示无数据
				currentdate:'',//当前日期
			}
		},
		mounted() {
			//执行下面的函数
			this.list = this.getnormlist();
			this.get3dlist();
			this.UrlSearch();
			this.videoHeight()
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
		},
		methods: {
			//获取常规标段列表
			getnormlist() {
				let that = this
				this.$http.post(that.global.domainurl + '/jeecg-boot/replace/getBidsectionListByTypeAndBelong ', {
					username: that.UrlSearch(),
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
//									if(arr[i].children[j].id === 'a0341955d5e77bbc56281a116d8752e1') {
//										//默认有打开一个，默认项有下拉，默认项又被选中的状态,默认的这一项数据较多所以选这一项
//										arr[i].ispull = true
//										arr[i].children[j].isactive = true;
//									}
								}
								arr[0].ispull = true
								arr[0].children[0].isactive = true;
								that.chartstart(arr[0].children[0].id)
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
					username: that.UrlSearch(),
					identify: '3d',
					menu: '环境监测'
				}).then(res => {
					if(res.data.code === 200) {
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
			UrlSearch(){
		        let url = window.location.href;
//		        let url='http://kaijin.zhoumc.cn/dist/#/envir?username=admin'
		        let m=url.split('?')[1].split('&')
		        let obj={}
		        for(let i=0;i<m.length;i++){
		          let a=m[i].split('=')
		          obj[a[0]]=a[1]
		        }
		        return obj.username
		    },
			//radio==='2'为3d，'1'为常规默认
			selectchange() {
				let that = this;
				if(this.radio === '2') {
					this.show3d = true
					//如果缓存中存在取缓存的list，没有久接口获取
					let list3d = localStorage.getItem("list3d")
					if(list3d) {
						this.list = JSON.parse(list3d)
					} else {
						this.list = this.get3dlist()
					}
				} else if(this.radio === '1') {
					this.show3d = false
					let listnorm = localStorage.getItem("listnormEnvir")
					if(listnorm) {
						this.list = JSON.parse(listnorm)
					} else {
						this.list = this.getnormlist()
					}

				}
				console.log(this.list)
			},
			//点击隧道下的节点，data参数为当前节点项的各种数据
			handleNodeClick(data, indx, index) {
				let arr = this.list,that = this;
				this.num=0;
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
				localStorage.setItem("listnormEnvir", JSON.stringify(arr));
				this.loadingshow = true;
				this.$http.post(that.global.domainurl + '/jeecg-boot/air/environmentalmonitoring', {
					engineeringId: data.id
				}).then(res => {
					this.loadingshow = false
					if(res.data.code === 0) {
						that.res=res
						that.changecharts(res)
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
			//切换数据
			changecharts(res){
				this.righttop = res.data.result;
				let chartidlist = [],isnodata=[],values=[],that=this;
				let currentdate=this.getdate()
				//这里才能确定展示多少个chart
				for(let i = 0, n = res.data.result[that.num].values.length; i < n; i++) {
					var name = "myChart" + i; //生成函数名						
					chartidlist.push("myChart" + i);//生成每个chart的id
					isnodata.push(false);//默认确定每个chart的没有数据项不展示
					values.push(currentdate);
				}
				//这一步确定有多少个chart
				that.chartidlist = chartidlist;
				that.values=values;
				that.isnodata=isnodata;
				that.currentdate=currentdate;
				that.$nextTick(() => {
					that.drawLine(res.data.result[that.num].values.length);
					//默认进来先进入鸡鸣隧道出口的第一个（出口值班室） 的数据，所以是res.data.result[0]，注意以后会不会更改
					for(let i = 0, l = res.data.result[that.num].values.length; i < l; i++) {
						let name = "myChart" + i; //生成函数名
						window[name] = that.$echarts.init(document.getElementById("myChart" + i));
						window[name].showLoading();
						that.$http.post(that.global.domainurl + '/jeecg-boot/air/dayline ', {
							date: currentdate,
							equipmentId: res.data.result[that.num].values[i].equipment_id,
							typeId: res.data.result[that.num].values[i].type_id
						}).then(resson => {
							let flag=resson.data.result.valueList.find(m => m.value != null);
							let unit=resson.data.result.unit==='无'?'':resson.data.result.unit
							window[name].hideLoading();
							window[name].setOption({
								legend: {
									data: [res.data.result[that.num].values[i].typeName + '(' + resson.data.result.unit + ')']
								},
								yAxis: {
									max:resson.data.result.max,
									type : 'value',
									axisLabel: {
										formatter:'{value}'+' '+unit
									}
								},
								series: [
									// 根据名字对应到相应的系列
									{
									type:'line',	
									name: res.data.result[that.num].values[i].typeName + '(' + resson.data.result.unit + ')',
									data: resson.data.result.valueList}
								]
							});
							let isnodata=JSON.parse(JSON.stringify(that.isnodata)) ;
							if(flag){						
								isnodata[i]=false;
								that.isnodata=isnodata;
							}else{
								isnodata[i]=true;
								that.isnodata=isnodata;
							}
							
						})
					}
					console.log(that.isnodata)
				})
			},
			changeRightTop(item,indx){
				this.num=indx
				this.changecharts(this.res)
			},
			videoHeight() {
			  	this.$nextTick(()=>{
					this.height=(document.documentElement.clientHeight).toFixed(2)+'px';
			  	})
			},
			//点击隧道
			handlelistpre(item, indx) {
				//点击常规隧道项，因为常规隧道都没有children
				if(item.children) {
					//	this.show3d=false
					if(item.children.length === 0) {
						this.$message({
							showClose: true,
							message: '此工地咱无视频监控'
						});
					} else if(item.children.length > 0) {
						let list =JSON.parse(JSON.stringify(this.list)) 
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
			//获取初始有多少个chart,获取chart初始数据，默认展示b1鸡鸣隧道出口的第一个（出口值班室） 的数据
			chartstart(id) {
				let that = this;
				this.loadingshow = true;
			//	a0341955d5e77bbc56281a116d8752e1是b1鸡鸣隧道出口出口值班室的id
				this.$http.post(that.global.domainurl + '/jeecg-boot/air/environmentalmonitoring', {
					engineeringId: id
				}).then(res => {
					this.loadingshow = false
					if(res.data.code === 0) {
						that.res=res
						that.changecharts(res)
						console.log(that.res)
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
			//获取今天的日期并且格式化
			getdate(){
                let nowDate = new Date();
                let date = {
                    year: nowDate.getFullYear(),
                    month: nowDate.getMonth() + 1,
                    date: nowDate.getDate(),
                }
                let mt=date.month<10?'0'+date.month: date.month;
                let day=date.date<10?'0'+date.date: date.date;
                return date.year + '-' + mt+ '-' +day;
			},
			//初始化各个chart
			drawLine(lth) {
				for(let i=0;i<lth;i++){
					let name='myChart'+i;
					window[name]=this.$echarts.init(document.getElementById("myChart"+i));
					window[name].setOption({
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
			},
			//各个chart日期变化后的接口请求和展示
			datechange(itemson,index){
				let that=this,name='myChart'+index;
				window[name] = this.$echarts.init(document.getElementById("myChart" + index));
				window[name].showLoading();
				this.$http.post(that.global.domainurl + '/jeecg-boot/air/dayline ', {
					date: this.values[index],
					equipmentId: this.righttop[this.num].values[index].equipment_id,
					typeId: this.righttop[this.num].values[index].type_id
				}).then(resson => {
					window[name].hideLoading();
					let flag=resson.data.result.valueList.find(m => m.value != null)
					window[name].hideLoading();
					window[name].setOption({
						legend: {
							data: [that.righttop[that.num].values[index].typeName + '(' + resson.data.result.unit + ')']
						},
						series: [{
							// 根据名字对应到相应的系列
							name: that.righttop[that.num].values[index].typeName + '(' + resson.data.result.unit + ')',
							data: resson.data.result.valueList
						}]
					});
					let isnodata=JSON.parse(JSON.stringify(that.isnodata)) ;
					if(flag){						
						isnodata[index]=false;
						that.isnodata=isnodata;
					}else{
						isnodata[index]=true;
						that.isnodata=isnodata;
					}
				})
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
	#envircont span{text-align: center;}
	#myChart {
		border-bottom: rem(1) solid $line_color;
	}
	canvas{width: 570px;}
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
		background-color: #eef0f3;
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
		text-align: left;
		transition: all 0.3s linear;
	}
	
	.itemsontxtactive {
		background-color: #eef0f3;
	}
	
	.itemsontxtno {
		color: rgba(144, 147, 153, 0.5);
	}
	
	.itemsontxtwarn {
		color: rgb(230, 162, 60, 0.6);
	}
	
	#envircont .itemsontxtxiala {
		height: 25px;
		line-height: 25px;
		opacity: 1;
	}
	
	#envircont .righticonxiala {
		transform: rotate(90deg);
	}
	
	.itemsontxt:hover {
		background-color: #eef0f3;
	}
	/*list*/
	
	.right {
		width: 100%;
		position: relative;
		overflow:scroll;
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
		margin-top: 150px;
	}
	
	.righttop {
		position: absolute;
		top: 30px;
		left: 0;
	}
	
	.righttopson {
		background: rgba(144,147,153,0.5);
		padding: 10px 20px;
		border-radius: 10px;
		color: #FFFFFF;
		font-size: 16px;
		font-weight: bold;
		margin-left: 100px;
	}
	
	.chartitem {
		position: relative;
		margin:0 10px 50px 0;
	}
	
	.datepicker {
		position: absolute;
		top: -10px;
		right: 30px;
		width: 140px;
	}
	.datenodata{position: absolute;
		top: 50%;text-align: center;
		left: 50%;transform: translateX(-50%) translateY(-50%);
	}
	.righttopsonactive{box-shadow: 1px 1px 10px 1px rgba(64, 158, 255, 0.8);background: rgba(64, 158, 255, 0.9);}
	.current{position: absolute;top: 0;left: 50px;font-size: 13px;background: rgba(194, 53, 49,0.8);color: #FFFFFF;padding: 2px 8px;border-radius: 4px;}
</style>