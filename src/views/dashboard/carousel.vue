<template>
	<div class="col-lg-12">
		<div class="thumbnail">
			<chp-carousel   :perPage="1" 
							:autoplay="true" 
							:autoplayHoverPause="true" 
							:loop="true" 
							:paginationPadding="5"
							:autoplayTimeout="3000"
							class="dashboard-carousel">
				<chp-slide v-for="(activity,index) in activities" class="slide-wrapper" :key="index">
					<!-- <chp-feature-image :src= "activity.imagepath || activity.image_link "/>
					 --><img class="slide-img" :src= "activity.imagepath || activity.image_link " alt="">
		      		<div class="mask">
						<h3><a :href="activity.url" target="_blank">{{ $t("more")}}</a></h3>
					</div>
		        </chp-slide>
		  	</chp-carousel>
	  	</div>
	</div>
</template>
<script>
	import activityService from "services/activityService"
	export default{
		data(){
			return {
				activities:[]
			}
		},
		created(){
			this.fetchData()
		},
		methods:{
			async fetchData(){
				let {success,data} = await activityService.getCampaigns(this.$store.state.language == "en" ? "english" : "mandarin")
				if(success){
					this.activities = data.items
				}
			}
		},
		watch:{
			"$store.state.language":function(){
				this.fetchData()
			}
		}
	}
</script>
<style lang="less">
	@import "~assets/less/variable.less";
	@import "~assets/less/transition.less";
	
	.VueCarousel-pagination{
		float:none !important;
	}
	.slide-img{
		width:100%;
		height:auto;
		max-height: 650px;
	}
	.slide-wrapper{
		position:relative;
		.featured-image{
			max-width: 900px;
			background-color: transparent;
		}
		.mask{
			position:absolute;
			left:0px;
			right:0px;
			top:0px;
			bottom:0px;
			.display(flex);
			.align-items(center);
			.justify-content(center);
			transition:@material-enter;
			h3{
				a{
					color:transparent;
				}
			}
			&:hover{
				h3 > a{
					color:@dark-color;
				}
				background-color: rgba(256,256,256,.6);	
			}
			
		}
	}
	html.dark{
		.slide-wrapper{
			.mask{
				&:hover{
					h3 > a{
						color:@light-color;
					}
					background-color: rgba(0, 0, 0,.6)
				}
				
			}
		}
	}
	@media(max-width:@screen-sm-min){
		.slide-img{
			width:100%;
			height:auto;
			max-height: auto;
		}
	}
</style>