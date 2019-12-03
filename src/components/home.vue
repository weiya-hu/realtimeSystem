<template>
	<div class="">
		<div class="" @click="tovideo">tovideo</div>
		<div class="" @click="toenvir">toenvir</div>
	</div>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods:{
  	tovideo(){
  		this.$router.push({
        path:'/video',
        query:{
          
        }
      })
  	},
  	toenvir(){
  		this.$router.push({
        path:'/envir',
        query:{
          
        }
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
h1, h2 {
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
</style>
