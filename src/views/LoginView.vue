<script setup>

import {useField, useForm} from 'vee-validate';
import {loginSchema} from '../validation/loginSchema';
import {  useAuthStore  }  from '../stores/auth';


const {handleSubmit} = useForm({ validationSchema: loginSchema });
const auth = useAuthStore(); // store de autenticación
import { ref } from 'vue';


//console.log(auth);

const email = useField('email');
const password = useField('password');

const visible = ref(false)

// console.log(email);
// console.log(password);

// values es un valor que recupera VeeValidate (se puede nombrar como tu quieras)
const submit = handleSubmit((values) => {
    auth.login(values);
});


</script>

<template>
  
    <h1 class="text-center text-h3 font-weight-bold my-5"></h1>

    <v-card
        flat
        max-width="600"
        class="mx-auto my-10"
    >
        <v-card-title class="text-h4 font-weihgt" tag="h4">
            Iniciar Sesión
        </v-card-title>

        <v-card-subtitle class="text-h5">
            Inicia Sesión con tu cuenta
        </v-card-subtitle>
        
        <!--  Alerta  -->
         <v-alert
            v-if="auth.hasError"
            class="my-5"
            :title="auth.errorMsg"
            type="error"
        ></v-alert>

        <!--Formulario-->
        <v-form class="mt-5">
            <v-text-field
                type="email"
                label="Email"
                bg-color="blue-grey-lighten-5"
                append-inner-icon="mdi-email"
                class="mb-5"
                v-model="email.value.value"
                :error-messages="email.errorMessage.value"
            />

            <v-text-field
                :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                :type="visible ? 'text' : 'password'"
                @click:append-inner="visible = !visible"
                type="password"
                label="Password"
                bg-color="blue-grey-lighten-5"
                class="mb-5"
                v-model="password.value.value"
                :error-messages="password.errorMessage.value"
            />

            <v-btn
                block
                color="pink-accent-3"
                @click="submit"
            >
                Inicia Sesión
            </v-btn>
        </v-form>


    </v-card>
  
</template>
