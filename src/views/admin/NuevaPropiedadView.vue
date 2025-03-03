<script setup>
import { ref } from 'vue';
import { useForm, useField } from 'vee-validate';
import { collection, addDoc } from "firebase/firestore";
import { useFirestore } from 'vuefire';
import { useRouter } from 'vue-router';
import { validationSchema, imageSchema}  from '@/validation/propiedadSchema';
import useImage from '@/composables/useImage';
import useLocationMap from '@/composables/useLocationMap';
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LMarker } from "@vue-leaflet/vue-leaflet";

const { uploadImage, image, url } = useImage();
const { zoom, center, pin } = useLocationMap();

const items = [1,2,3,4,5];

const router = useRouter();
const db = useFirestore();

const { handleSubmit } = useForm({
    // pasamos en un solo obj el esquema de validación
    validationSchema: {
        ...validationSchema,
        ...imageSchema
    }
});

const titulo = useField('titulo');
const imagen = useField('imagen');
const precio = useField('precio');
const habitaciones = useField('habitaciones');
const wc = useField('wc');
const estacionamiento = useField('estacionamiento');
const descripcion = useField('descripcion');
const alberca = useField('alberca', null, {initialValue: false})

// ** Crear Propiedad **

// si pasa las validaciones se ejecuta
const submit = handleSubmit(async (values) => {
    //console.log(values);
    // quitamos la img en los values
    const { imagen, ...propiedad} = values;
    // console.log(values);
    // console.log(imagen);
    //console.log(propiedad);

    // return
    // Add a new document with a generated id. creamos la db llamada propiedades
    const docRef = await addDoc(collection(db, "propiedades"), {
        ...propiedad,
        imagen: url.value,
        ubicacion: center.value
    });
    //console.log("Document written with ID: ", docRef.id);
    // si nos genera un id - redireccionamos al usuario
    if (docRef.id) {
        router.push({name: 'admin-propiedades'})
    }
})
</script>

<template>
    
    <v-card max-width="800" flat class="mx-auto my-5">
        <v-card-title class="text-h4 font-weihgt" tag="h4">
           Nueva Propiedad
        </v-card-title>

        <v-card-subtitle class="text-h5">
            Crea una nueva propiedad llenando el siguiente formulario
        </v-card-subtitle>

        <v-form class="mt-10">
            <v-text-field 
                class="mb-5"
                label="Titulo Propiedad"
                prepend-icon="mdi-home"
                v-model="titulo.value.value"
                :error-messages="titulo.errorMessage.value"
            />

            <v-file-input
                accept="image/jpeg"
                label="Fotografía"
                prepend-icon="mdi-camera"
                clear-icon="mb-5"
                v-model="imagen.value.value"
                :error-messages="imagen.errorMessage.value"
                @change="uploadImage"
            />
            <!--Imagen -->
            <div v-if="image" class="my-5 d-flex align-center flex-column">
                <p class="font-weight-bold my-1">Imagen Propiedad:</p>
                <img class="w-50 my-2" :src="image" alt="img-propiedad-formulario">
            </div>

            <v-text-field 
                class="mb-5"
                label="Precio"
                prepend-icon="mdi-currency-usd"
                v-model="precio.value.value"
                :error-messages="precio.errorMessage.value"
            />

            <v-row>
                <v-col
                    cols="12"
                    md="4"
                >
                    <v-select 
                        class="mb-5"
                        label="Habitaciones"
                        prepend-icon="mdi-door"
                        :items="items"
                        v-model="habitaciones.value.value"
                        :error-messages="habitaciones.errorMessage.value"
                    />
                </v-col>

                <v-col
                    cols="12"
                    md="4"
                >
                    <v-select 
                        class="mb-5"
                        label="WC"
                        prepend-icon="mdi-toilet"
                        :items="items"
                        v-model="wc.value.value"
                        :error-messages="wc.errorMessage.value"
                    />
                </v-col>

                <v-col
                    cols="12"
                    md="4"
                >
                    <v-select 
                        class="mb-5"
                        label="Lugares Estacionamiento"
                        prepend-icon="mdi-car"
                        :items="items"
                        v-model="estacionamiento.value.value"
                        :error-messages="estacionamiento.errorMessage.value"
                    />                
                </v-col>    
            </v-row>

            <v-textarea
                class="mb-5"
                label="Descripción"
                prepend-icon="mdi-text-box-outline"
                v-model="descripcion.value.value"
                :error-messages="descripcion.errorMessage.value"
            ></v-textarea>

            <v-checkbox
                v-model="alberca.value.value"            
                label="Alberca"
            />

            <!-- Mapa -->
            <h2 class="font-weight-bold my-5 text-center">Ubicación</h2>             
            <div class="pb-10" v-if="center">
                <div style="height:500px;">
                    <LMap
                        v-model:zoom="zoom" 
                        :center="center" 
                        :use-global-leaflet="false"
                    >
                    <LMarker
                        :lat-lng="center"
                        draggable
                        @moveend="pin"
                    />   
                    <LTileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        ></LTileLayer>
                    </LMap>
                </div>
            </div>

            <v-btn
                block
                color="pink-accent-3"
                @click="submit"
            >
                Agregar Propiedad
            </v-btn>

        </v-form>
    </v-card>
</template>
