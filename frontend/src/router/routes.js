
const routes = [
  {
    path: '/entrar',
    component: () => import('pages/entrar.vue')
  },
  {
    path: '/',
    component: () => import('pages/admin.vue'),
    
  },
  {
    path: '/login',
    component: () => import('pages/login.vue'),
    
  },
  {
    path: '/tecnico',
    component: () => import('layouts/layoutTecnico.vue'),
    children:[
      {
        path: '/tecnico/ordenSalida',
        component: () => import('pages/ordenSalida.vue')
      }
    ]
  },
  {
    path: '/app',
    component: () => import('layouts/MyLayoutNueva.vue'),
    children:[
      {
        path: '/app/index',
        component: () => import('pages/index.vue')
      },
      {
        path: '/app/persona',
        component: () => import('pages/persona.vue')
      },
      {
        path: '/app/servicioTaller',
        component: () => import('pages/servicioTaller.vue')
      },
      {
        path: '/app/motos',
        component: () => import('pages/motos.vue')
      },
      {
        path: '/app/tipoMoto',
        component: () => import('pages/tipoMoto.vue')
      },
      {
        path: '/app/tablaMantenimiento',
        component: () => import('pages/tablaMantenimiento.vue')
      },
      {
        path: '/app/marca',
        component: () => import('pages/marca.vue')
      },
      {
        path: '/app/ordenEntrada',
        component: () => import('pages/ordenEntrada.vue')
      },
      {
        path: '/app/ordenSalidaNueva',
        component: () => import('pages/ordenSalidaNueva.vue')
      },
      {
        path: '/app/buscarOrden',
        component: () => import('pages/buscarOrden.vue')
      },
      {
        path: '/app/reporteTecnico',
        component: () => import('pages/reporteTecnico.vue')
      },
      {
        path: '/app/movil',
        component: () => import('pages/movil.vue')
      },
      
      
      
      
      
      
      
      
      
      {
        path: '/app/ordenSalida',
        component: () => import('pages/ordenSalida.vue')
      },
      
      
      
      {
        path: '/app/registro',
        component: () => import('pages/registro.vue')
      } 
    ]
  }
]
// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
