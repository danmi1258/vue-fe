<template>
	<div class="col-lg-12 col-md-12">
	
		<form-doku v-if="method == 'doku'"></form-doku>
		<form-fasa-pay v-else-if="method == 'fasaPay'"></form-fasa-pay>
		<template v-else-if="method.indexOf('unionPay') > -1">
			<form-union-pay :methodCode="methodCode"></form-union-pay>
		</template>
		<form-wire-transfer v-else-if="method == 'wireTransfer'"></form-wire-transfer>

	</div>
</template>
<script>
import doku from "./forms/doku.vue"
import fasaPay from "./forms/fasaPay"
import unionPay from "./forms/unionPay"
import wireTransfer from "./forms/wireTransfer"
	export default{
		props:{
			method:{
				type:String,
				required: true
			},
			methodCode:{
				type:String,
				required: true
			}
		},
		components: {
			'form-doku' : doku,
			'form-fasa-pay' : fasaPay,
			'form-union-pay' : unionPay,
			'form-wire-transfer': wireTransfer
		},
		created(){
			console.log("form created",this.method);
		}
	}
</script>