const routes = [{
  path: '/',
  redirect: '/login'
},
{
  path: '/main',
  component: () => import('layouts/MainLayout.vue'),
  children: [{
    path: '',
    component: () => import('pages/Index.vue')
  },
  {
    path: '/merchant',
    component: () => import('pages/Merchant.vue')
  },
  {
    path: '/channel',
    component: () => import('pages/Channel.vue')
  },
  {
    path: '/subChannel',
    component: () => import('pages/SubChannel.vue')
  },
  {
    path: '/order',
    component: () => import('pages/Order.vue')
  },
  {
    path: '/user',
    component: () => import('pages/User.vue')
  },
  {
    path: '/role',
    component: () => import('pages/Role.vue')
  },
  {
    path: '/merchantChannel',
    component: () => import('pages/MerchantChannel.vue')
  }
  ]
},
{
  path: '/login',
  component: () => import('pages/Login.vue'),
},

// Always leave this as last one,
// but you can also remove it
{
  path: '/:catchAll(.*)*',
  component: () => import('pages/Error404.vue')
}
]

export default routes
