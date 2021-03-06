<i18n src="../../i18n.yaml"></i18n>
<template lang="html">

      <form slot="body" class="form-horizontal form-bordered " method="POST"  target="_blank" ref="accountForm">
       <div class="form-group" :class="errorClass('MT4')">
          <label class="control-label col-md-3">MT4 | {{ $t('withdrawal.balance') }}
            <span class="required" aria-required="true">*</span>
          </label>
          <div class="col-md-6" >
            <mu-select-field v-model="model.mt4_id" 
                        name="mt4_id">
              <template v-for="mt4 in MT4">
                <mu-menu-item :value="mt4.id" :title="mt4.text" key="mt4.id"/>
              </template>
            </mu-select-field>
             <span slot="required" class="error" v-if="validator.errors.has('MT4:required')">{{errors.first('MT4:required')}}</span>
          </div>
        </div>
        <div class="form-group" :class="errorClass('withdraw_pay')">
          <label class="control-label col-md-3"> 
            {{ $t('withdrawal.amount') }} ({{baseCurrency}})
            <span class="required" aria-required="true">*</span>
          </label>
          <div class="col-md-6">
            <mu-text-field  v-model="model.order_amount" 
                            @input="amountInput" 
                            @blur="amountInput"  
                            name="withdraw_pay"  
                            class="form-control"   
                            :fullWidth="true" />
            <br>
            <span slot="required" class="error" v-if="validator.errors.has('withdraw_pay:required')">{{validator.errors.first('withdraw_pay:required')}}</span>
            <span slot="required" class="error" v-if="validator.errors.has('withdraw_pay:positiveFloatMoney')">{{validator.errors.first('withdraw_pay:positiveFloatMoney')}}</span>
            <span slot="required" class="error" v-if="validator.errors.has('withdraw_pay:moneyRange')">{{validator.errors.first('withdraw_pay:moneyRange')}}</span>
          </div>
        </div>
        <div class="form-group" :class="errorClass('withdrawMethod')">
          <label class="control-label col-md-3"> {{ $t('withdrawal.methods') }}
            <span class="required" aria-required="true">*</span>
          </label>
          <div class="col-md-6" >
            <mu-select-field v-model="model.method" 
                        name="withdrawMethod" 
                        :hintText="nullHintText">
              <template v-for="(value,key) in methodsAndAccounts">
                <mu-menu-item :value="key" :title="$t('payMentMethod.'+key)" key="key"/>
              </template>
            </mu-select-field>
             <span slot="required" class="error" v-if="validator.errors.has('withdrawMethod:required')">{{validator.errors.first('withdrawMethod:required')}}</span>
          </div>
        </div>
        <div class="form-group" :class="errorClass('bank_code')">
          <label class="control-label col-md-3">
            {{ $t('withdrawal.account') }}
            <span class="required" aria-required="true">*</span>
          </label>
          <div class="col-md-6" >
           <mu-text-field :hintText="$t('withdrawal.nullAccount')" class="form-control"   :fullWidth="true"  :disabled="true" v-if="accounts.length <1"/>
           <mu-select-field v-model="model.bank_code"  name="bank_code" v-else>
              <template  v-for="a in accounts" >
                <mu-menu-item :value="a.accountId" :title="a.bankName+'|'+a.accountNumber" key="mt4.id"/>
              </template>
           </mu-select-field>
             <span slot="required" class="error" v-if="validator.errors.has('bank_code:required')">{{validator.errors.first('bank_code:required')}}</span>
          </div>
        </div>
        <div class="form-group">
          <label class="control-label col-md-3">{{ $t('withdrawal.fee') }} ({{baseCurrency}})</label>
          <div class="col-md-6">
            <mu-text-field v-model="fee" class="form-control"   :fullWidth="true" name="order_amount" :disabled="true"/>
          </div>
        </div>
      </form> 

</template>

<script>

import validateMixin from 'mixins/validatemix'
import fundsService from 'services/fundsService' 
import { Validator } from 'vee-validate'
   
export default {
  mixins:[validateMixin],
  data(){
      return {
        MT4 : [],
        defaultMT4:0,
        methodsAndAccounts: {},
        nullHintText:"",
        fee:null,
        validator:null,
        model : {
          mt4_id : "",
          order_amount: "",
          bank_code:"",
          method:""
        },
        filedKeys:{
          doku:"withdraw_pay_doku",
          fasaPay:"withdraw_pay_fasa",
          unionPay:"withdraw_pay",
          wireTransfer:"withdraw_pay_bank_wire"
        }
      }
    },
    watch :{
      "$store.state.language" : function(val,oldVal){
        if(val == oldVal){ return;}
        this.fetchMethodsAccounts();
      },
      methodsAndAccounts:function(data,oldVal){
            this.$set(this.model,"method",Object.keys(data)[0])
      },
      'model.method':function(method){
          if(this.methodsAndAccounts[method].accounts.length<1){
            this.$set(this.model,"bank_code","")
          }else{
            this.$set(this.model,"bank_code",this.methodsAndAccounts[method].accounts[0].accountId)
          }
          this.fee = this.methodsAndAccounts[method].fees
          this.validator.detach('withdraw_pay')
          this.validator.attach('withdraw_pay','required|positiveFloatMoney|moneyRange:'+this.filedKeys[method]+"")
      }
   },
    methods:{
      
      async fetchMethodsAccounts(){
        let {success,data} = await fundsService.getWithdrawMethod(this.$store.state.language)
        if(success && data){
          this.methodsAndAccounts = data;
        }
      },
      fetchMT4(){
        this.MT4 = this.$store.state.mt4Accounts.map((mt4)=>{
          return {
            id:mt4.mt4_id,
            text:"#"+mt4.mt4_id+" | "+mt4.balance,
            baseCurrency:mt4.base_currency
          }
        });
        this.$set(this.model,"mt4_id",this.defaultMT4 ? Number(this.defaultMT4) : this.MT4[0].id)
      },
      async validate(){
        console.log(this.model,"validate")
        let validateResult = await this.validator.validateAll({MT4:this.model.mt4_id,withdrawMethod:this.model.method})
        validateResult = validateResult && await this.validateAmount(this.model.order_amount) && await this.validateBankCode(this.model.bank_code) ;
        if(validateResult){
          this.$emit("submit",this.model);
        }
        return validateResult;
      },
      submit(){

      },
      async amountInput(){
        return await this.validateAmount(this.model.order_amount)
      },
      async validateAmount(val){
        let result = await this.validator.validate('withdraw_pay',val)
        console.log(result,"***8",this.validator.errors)
        return result
      },
      async validateBankCode(val){
        return await this.validator.validate('bank_code',val)
      },
      init(){
        this.$set(this.model,"order_amount","")
      },
      initValidator(){
        this.validator = new Validator()
        this.validator.attach('bank_code','required')
        this.validator.attach('withdraw_pay','required|positiveFloatMoney')
        this.validator.attach('MT4','required')
        this.validator.attach('withdrawMethod','required')
        
      }
    },
    computed:{
     accounts:function(){
        return this.model.method && this.methodsAndAccounts && this.methodsAndAccounts[this.model.method] && this.methodsAndAccounts[this.model.method].accounts
      },
      baseCurrency:function(){
        let currency = this.MT4.filter(mt4 => {
          return mt4.id == this.model.mt4_id;
        });
        return currency && currency[0] && currency[0].baseCurrency;
      }
    },
    created(){
      this.$emit("loading",true)
      this.initValidator()
      this.defaultMT4 = this.$route.query && this.$route.query.mt4Id ? this.$route.query.mt4Id+"" : ""
      this.fetchMT4()
      let self = this
      Promise.all([this.fetchMethodsAccounts()]).then(function(){
            self.$emit("loading",false)
      });
    }
  }
</script>
