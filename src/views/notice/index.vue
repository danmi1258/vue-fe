<i18n src="./i18n.yaml"></i18n>
<template lang="html">
	<div class="container-fluid">
		<div class='row'>
			<div class="col-sm-12">
				<div class="pull-right mb-md">
				<form class="form-inline">
					<div class="form-group" :class="errorClass('startDate')">
						<chp-date-picker :hintText="$t('ui.datePicker.startDate')" v-model.lazy="model.startDay" @input="changeStartday" :fullWidth="true" :required="true"  v-validate="'required'" data-vv-value-path="model.startDay" data-vv-name="startDate" data-vv-validate-on="change" :maxDate="maxStartDate"/>
							<span slot="password" class="error"
						v-if="errors.has('startDate:required')">{{errors.first('startDate:required')}}</span>
					</div>
					<div class="form-group " :class="errorClass('endDate')">
						<chp-date-picker :hintText="$t('ui.datePicker.endDate')" @input="changeEndday" :minDate = "minEndDate" v-model.lazy="model.endDay"  v-validate="'required'" data-vv-value-path="model.endDay" data-vv-name="endDate" :fullWidth="true" :required="true" data-vv-validate-on="change"/>
							<span slot="password" class="error"
						v-if="errors.has('endDate:required')">{{errors.first('endDate:required')}}</span>
					</div>
					<chp-button class="mb-xs mt-xs mr-xs btn btn-primary print-btn" @click="research">
						<i class="fa fa-search "></i>
					</chp-button>
				</form>
				</div>
			</div>
			<div class='col-md-12 col-lg-12 col-sm-12'>
				<chp-tabs :value='activeTab' :isJustified='true' :isPrimary='true' @change='handleTabChange'>
					<template slot='header'>
						<chp-tab-header href='announcement'>{{ $t('notification.announcement') }}</chp-tab-header>
						<chp-tab-header href='action'>{{ $t('notification.action') }}</chp-tab-header>
						<chp-tab-header href='course'>{{ $t('notification.course') }}</chp-tab-header>
					</template>
					<template slot='content'>
						<chp-expand-transition name="chp-fade">
							<keep-alive>
								<component v-bind:is="currentView" ref="signelCategoryNotice"></component>
							</keep-alive>
						</chp-expand-transition>
					</template>
				</chp-tabs>
			</div>
		</div>
	</div>
</template>

<script>
	import announcement from './announcement.vue'
	import action from './action.vue'
	import course from './course.vue'
	import validateMixin from 'mixins/validatemix.js'
	
	export default {
		mixins: [validateMixin],
		components: {
			'notice-announcement': announcement,
			'notice-action': action,
			'notice-course': course
		},
		data() {
			return {
				activeTab: "announcement",
				currentView: "notice-announcement",
				minEndDate:"",
        		maxStartDate:"",
				model:{
          		startDay:"",
          		endDay:""
          },
			}
		},
		methods: {
			handleTabChange(val) {
				this.activeTab = val
			},
			research(){				
				this.$refs.signelCategoryNotice.research(this.model)
			},
			changeEndday(val){
      	this.model.endDay = val;
      }	,
      changeStartday(val){
      	this.model.startDay = val;
      }
		},
		watch: {
			activeTab(val) {
				this.currentView = 'notice-' + val
			},
			'model.startDay' : function(val){
    		this.minEndDate = val;
    	},
      'model.endDay':function(val){
        this.maxStartDate = val;
      },

		}
	}

</script>