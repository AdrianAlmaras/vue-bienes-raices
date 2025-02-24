import { createRouter, createWebHistory } from 'vue-router';
import { onAuthStateChanged } from 'firebase/auth';
import {  useFirebaseAuth  } from 'vuefire';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'), // se carga el componente hasta q el user vaya a esa ruta
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/admin/AdminLayoutView.vue'),
      meta: {requiresAuth: true},
      // rutas anidadas
      children: [
        {
          path: '/admin/propiedades',
          name: 'admin-propiedades',
          component: () => import('../views/admin/AdminView.vue'),
          meta: {requiresAuth: true},
        },
        {
          path: '/admin/nueva',
          name: 'nueva-propiedad',
          component: () => import('../views/admin/NuevaPropiedadView.vue'),
          meta: {requiresAuth: true},
        },
        {
          path: '/admin/editar/:id',
          name: 'editar-propiedad',
          component: () => import('../views/admin/EditarPropiedadView.vue'),
          meta: {requiresAuth: true},
        },
      ]
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue'),
    // },
  ],
})

// proteger rutas si el usuario no esta authenticado

// Guard de navegación
router.beforeEach(async(to, from, next) => {
  //console.log(to); // a donde vamos
  //console.log(from); // donde nos encontramos
  //console.log(next);
  const requiresAuth = to.matched.some(url => url.meta.requiresAuth)
  if(requiresAuth) {
    // comprobar que el usuario este autenticado
    try {
      // 
      await authenticateUser()
      next() // siguiente middleware
    } catch (error) {
      console.log(error);
      // si el usuario no esta autenticado
      next({name: 'login'})
    }
  } else {
    // no esta protegido, mostramos la vista
    next()
  }
  //console.log(requiresAuth);
});



function authenticateUser() {
  const auth = useFirebaseAuth();
  return new Promise((resolve, reject) => {
    // observer patron de diseño 
    // revisar cuando estas interesado en revisar un cambio en el state de tu app
    
    // unsubscribe técnica que nos permite dejar de escuchar cambios que ocurran 
    // en onAuthStateChanged
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      //console.log(user);
      unsubscribe()
      if(user) {
        resolve()
      } else {
        reject()
      }

    });

  });
}

export default router
