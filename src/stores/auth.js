import {  ref, computed, onMounted  } from 'vue'
import { defineStore } from "pinia";
import {  useFirebaseAuth  } from 'vuefire';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter   } from 'vue-router';

export const useAuthStore = defineStore('auth', () => {
    const auth = useFirebaseAuth();
    const authUser = ref(null);
    const router = useRouter();

    //console.log(authUser.value);
    const errorMsg = ref('');
    // diccionario de errores
    const errorCodes = {
        'auth/invalid-credential': 'El correo o el password ingresados son incorrectos.',
        'auth/user-not-found': 'Usuario no encontrado',
        'auth/wrong-password': 'Password incorrecto',
    };

    // ejecuta el codigo cuando se monte el componente
    onMounted(() => {
        //recuperar la sesión que el usario habia iniciado anteriormente
        //obtener el usuario con sesión activa
        onAuthStateChanged(auth, (user) => {
            if(user) {
                //console.log(user);
                authUser.value = user;
            }
        });
    });

    // autenticacion por firebase
    const login = (values) => {
        signInWithEmailAndPassword(auth, values.email, values.password)
            .then( (userCredential) => {
                //console.log(userCredential);
                // Signed in 
                const user = userCredential.user;
                //console.log(user);
                authUser.value = user;
                // redirigimos al usuario;
                router.push({name: 'admin-propiedades'});
                console.log('Iniciando Sesión');
                //console.log(authUser.value);
                //console.log(authUser.value);
                errorMsg.value = '';
            })

            .catch(error => {
                //console.log(error.code);
                console.log(errorCodes[error.code]);
                errorMsg.value = errorCodes[error.code];
            })

        };

        const logout = () => {
            // cierra sesión en firebase
            signOut(auth).then(() => {
                authUser.value = null;
                // redirigimos al usuario;
                router.push({name: 'login'});
                console.log('Cerrando sesión');
            }).catch(error => {
                console.log(error);
            })

            
        };
    
        const hasError = computed(() => {
            return errorMsg.value;
        });

        const isAuth = computed(() => {
            return authUser.value;
        });

    return {
        logout,
        login,
        hasError,
        errorMsg,
        isAuth,
    }
})