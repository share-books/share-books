declare type Item = { // 书、评论等
  id : number,// 唯一标识，自增
  parent : number,//所属id
  type: string,//book,comment
  title : string,//标题
  uid : string,//拥有者id
  by? : string,//拥有者姓名
  text? : string,//具体内容
  images?: string,//相关图片
  time? : number,//产生时间
  
 // __lastUpdated？: number,//时间戳
  liker? : Array<string>,// 喜欢者列表
  kids? : Array<number>// 下属列表
}

declare type User = { // 用户资料
  uid : string,// 唯一标识
  phone : string,//电话号码,不得重复
  money : number,//虚拟资金
  displayName : string,//昵称
  email? : string,//电子邮件
 // __lastUpdated？: number//时间戳
  likes? : Array<number>,// 喜欢的书列表
  books? : Array<number>// 拥有书列表
  comments? : Array<number>// 评价列表
}

declare type TransactionLog = { // 用户交易记录
  fromId : string,// 出款用户id
  toId : string,//   入款用户id
  type : string,//交易类型：押金 租金 
  amount : number,//金额
  time? : number,//产生时间
  //__lastUpdated？: number//时间戳
  
}
/*
function findMax<T>(arr: T[], compare: (a: T, b: T) => number) {
  var sorted = arr.sort(compare);
  return sorted[sorted.length - 1];
}*/