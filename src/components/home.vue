<template>
	<div class="home">
		<div class="" @click="tovideo">视频</div>
		<div class="" @click="toenvir">环境</div>
		<div class="" @click="togas">气体</div>
		<div class="" @click="toperson">人员</div>
	</div>
</template>

<script>
	export default {
		name: 'Home',
		data() {
			return {

			}
		},
		methods: {
			tovideo() {
				this.$router.push({
					path: '/video',
					query: {}
				})
			},
			toenvir() {
				this.$router.push({
					path: '/envir',
					query: {}
				})
			},
			togas() {
				this.$router.push({
					path: '/gas',
					query: {}
				})
			},
			toperson(){
				this.$router.push({
					path: '/person',
					query: {}
				})
			},
			open() {
				this.$alert('这是一段内容', '标题名称', {
					confirmButtonText: '确定',
					callback: action => {
						this.$message({
							type: 'info',
							message: `action: ${ action }`
						});
					}
				});
			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	h1,
	h2 {
		font-weight: normal;
	}
	
	ul {
		list-style-type: none;
		padding: 0;
	}
	
	li {
		display: inline-block;
		margin: 0 10px;
	}
	
	a {
		color: #42b983;
	}
	.home div{margin: 10px;font-size: 28px;font-weight: bold;color: #E69D87;}
</style>