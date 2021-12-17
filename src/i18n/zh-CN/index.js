export default {
  siteTitle: '聚合支付管理',
  login: '登录',
  username: '用户名',
  password: '密码',
  cancel: '取消',
  tips: '提示',
  usernameAndPasswordMustProvided: '用户名及密码必须提供',
  confirm: '确定',
  loginFailed: '登录失败',
  navigationCaption: '导航',
  operation: '操作',
  search: '搜索',
  add: '添加',
  update: '更新',
  success: '成功',
  failed: '失败',
  duplicate: '数据重复',
  showDetail: '查看详情',
  detail: '详情',
  available: '可用',
  unavailable: '不可用',
  showSubChannel: '查看子通道',
  delete: '删除',
  deleteConfirm: '确认要删除吗?',
  dispatch: '分配',
  noModifyWithSuper: '无法更改超级管理员角色',
  dispatchChannel: '分配通道',
  addMoney: '添加资金',
  addMoneyMessage: '正数添加资金，负数扣除资金，操作渠道：',
  testFee: '手续费试算',
  navigation: {
    merchant: '商户管理',
    merchantCaption: '商户信息、密钥、回调地址配置等管理',
    channel: '渠道管理',
    channelCaption: '支付及代付渠道、子渠道信息管理',
    order: '支付订单管理',
    orderCaption: '支付订单查询，包括手动加款订单',
    payoutOrder: '代付订单管理',
    payoutCaption: '代付订单查询，包括手动减款订单',
    user: '用户管理',
    userCaption: '后台管理用户及用户角色分配管理',
    authorize: '权限管理',
    authorizeCaption: '角色及资源权限配置管理',
    subChannel: '子渠道管理',
    merchantChannel: '商户通道',
    settings: '其他设置',
    settingsCaption: '其他一些杂项的信息配置',
  },
  merchantField: {
    id: '商户ID',
    name: '商户名称',
    balance: '可用余额',
    frozen: '冻结资金',
    totalIncome: '总入账流水',
    totalRealIncome: '总入账金额',
    totalPayout: '总出账',
    payCallbackUrl: '代收回调地址',
    payoutCallbackUrl: '代付回调地址',
    redirectUrl: '跳转地址',
    secret: '密钥',
    createTime: '创建时间'
  },
  channel: {
    id: '通道ID',
    name: '通道名称',
    code: '通道代码',
    state: '状态',
    balance: '可用余额',
    frozen: '冻结资金',
    totalEarn: '总收益',
    totalIncome: '总入账流水',
    totalRealIncome: '总入账金额',
    totalPayout: '总出账',
    createTime: '创建时间'
  },
  subChannel: {
    id: '子通道ID',
    subName: '子通道名称',
    type: '通道类型',
    type1: '支付通道',
    type2: '代付通道',
    maxAmount: '单笔最大限额',
    minAmount: '单笔最小限额',
    feeExpr: '费用计算表达式',
    feeRate: '浮动费率(%)',
    feeFixed: '固定费率',
    fixedAmount: '固定费率最大金额(包括)',
    dailyLimit: '日限额',
    dailyAmount: '日已用额度',
    merchantNo: '商户号',
    secretKey: '密钥',
    remark: '备注',
    state: '状态',
    createTime: '创建时间'
  },
  order: {
    id: '交易ID',
    merchantId: '商户ID',
    channelCode: '通道代码',
    tradeId: '商户交易ID',
    amount: '交易金额',
    fee: '手续费',
    channelFee: '通道手续费',
    payUser: '商户用户信息',
    remark: '备注',
    payerName: '支付人',
    payerMobile: '支付人手机',
    payerVirtualAddress: '支付人虚拟地址',
    state: '状态',
    notifyState: '通知状态',
    repairFlag: '补单状态',
    createTime: '创建时间',
    successTime: '成功时间',
    state1: '等待支付',
    state2: '支付成功',
    state3: '支付失败',
    state4: '交易关闭',
    state9: '交易完成',
    notifyState1: '通知中',
    notifyState2: '通知失败',
    notifyState3: '通知完成',
  },
  role: {
    roleName: '角色',
    roleDesc: '角色描述'
  },
  merchantChannel: {
    channel: '通道',
    subChannel: '子通道',
    maxAmount: '单笔最大限额',
    minAmount: '单笔最小限额',
    feeExpr: '费用计算表达式',
    feeRate: '费率(%)',
    feeFixed: '固定费率',
    fixedAmount: '固定费率最大金额(包括)',
    dailyLimit: '单日限额',
    dailyAmount: '单日已用额度',
    remark: '备注',
    state: '状态',
    balance: '可用余额',
    frozen: '冻结余额',
    totalIncome: '总入账流水',
    totalMerchantIncome: '商户实际入账',
    totalPayout: '总出账',
  },
  paygContact: {
    companyName: '公司名称',
    firstName: '名',
    lastName: '姓',
    address: '地址',
    city: '城市',
    state: '州',
    zipCode: '邮编',
    country: '国家',
    mobileNo: '手机',
    email: '邮箱',
    status: '状态',
  },
  payoutOrder: {
    id: '交易ID',
    merchantId: '商户ID',
    channelCode: '通道代码',
    tradeId: '商户交易ID',
    amount: '交易金额',
    fee: '手续费',
    accountNumber: '账号',
    beneficiaryName: '收款人',
    bankName: '银行',
    branchName: '支行',
    bankCode: '银行IFSC代码',
    status: '状态',
    status1: '已创建',
    status2: '验证中',
    status3: '已验证',
    status4: '支付中',
    status5: '银行支付中',
    status6: '已支付',
    status01: '验证失败',
    status02: '支付失败',
  },
  odinmoSender: {
    name: '姓名',
    senderMobileNumber: '手机号',
    city: '城市',
    state: '州',
    pinCode: 'Pin Code',
    address: '地址',
    status: '状态',
    status1: '已创建',
    status0: '创建失败',
  }
}
