<template>
	<div class="container-fluid" >
		<div class="row">
    		<chp-expand-transition>
    			<ticket-list-add v-if="show" @cancel="cancel" @close="close"></ticket-list-add>
    		</chp-expand-transition>
    	</div>
    	<div class="row">
    		<ticket-list-table @add="addNew" @detail="detail" ref="table"></ticket-list-table>
    	</div>
    </div>
</template>
<script>
	import tableList from "./table.vue"
	import addNewTicket from "./add.vue"
	import ticketDetail from "../ticketDetail/index"
	export default{
		data(){
			return {
				show:false
			}
		},
		components:{
			"ticket-list-table" : tableList,
			"ticket-list-add" : addNewTicket,
			"ticket-detail" : ticketDetail
		},
		methods:{
			close(){
				this.$refs.table.refresh()
				this.show = false	
			},
			addNew(){
				this.show = true
			},
			cancel(){
				this.show = false
			},
			detail(id){
				console.log("detail")
				this.$emit("close",'list',id)
			}
		}
	}
</script>