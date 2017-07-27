export default {
  zh:{
    password : (field) => `${field}必须包括8个字符，包括数字，大写字母和小写字母`,
    positiveFloatMoney : (field) => `${field}格式不对，小数点之后最多两位`
  },
  en:{
    password : (field) => `${field} at least 8 characters including number ,lower capital and upper capitals`,
    positiveFloatMoney : (field) => `${field} is error.There is at most two digitals after decimal`
  }
}
