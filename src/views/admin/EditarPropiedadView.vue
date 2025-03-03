<script setup>
import {  watch  } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useFirestore, useDocument } from 'vuefire';
import { doc, updateDoc } from 'firebase/firestore';
import { useField, useForm } from 'vee-validate'
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer,LMarker } from "@vue-leaflet/vue-leaflet";
import useImage from '@/composables/useImage'
import useLocationMap from '@/composables/useLocationMap'
import { validationSchema } from '@/validation/propiedadSchema'


const items = [1,2,3,4,5]

const { url, uploadImage, image } = useImage()
const { zoom, center, pin } = useLocationMap()

const { handleSubmit } = useForm({ validationSchema });

const titulo = useField('titulo')
const imagen = useField('imagen')
const precio = useField('precio')
const habitaciones = useField('habitaciones')
const wc = useField('wc')
const estacionamiento = useField('estacionamiento')
const descripcion = useField('descripcion')
const alberca = useField('alberca')

// tiene la info de la ruta que estamos utilizando
const route = useRoute()
// Rutas del sistema
const router = useRouter()
//console.log(route.params.id);

// Obtener la Propiedad a editar

// para obtener un registro usar useDocument

const db = useFirestore(); // identificador de nuestro proyecto -- importar la ref
// conexion, collection, id del documento
const docRef = doc(db, 'propiedades', route.params.id); // obtenemos la ref del documento

const propiedad = useDocument(docRef); // nos traemos el documento 

//console.log(propiedad);
watch(propiedad, (propiedad) => {
      titulo.value.value = propiedad.titulo
      precio.value.value = propiedad.precio
      habitaciones.value.value = propiedad.habitaciones
      wc.value.value = propiedad.wc
      estacionamiento.value.value = propiedad.estacionamiento
      descripcion.value.value = propiedad.descripcion
      alberca.value.value = propiedad.alberca
      center.value = propiedad.ubicacion
  });

// Validación de formulario
const submit = handleSubmit(async values => {
    //console.log(values);
    const { imagen, ...propiedad } = values;
    if(image.value) {
        const data = {
            ...propiedad,
            ubicacion: center.value,
            imagen: url.value // url de imagen subida

        };
        await updateDoc(docRef, data);
    }else {
        //console.log(propiedad);
        //console.log(center.value);

        const data = {
            ...propiedad,
            ubicacion: center.value
        };
        await updateDoc(docRef, data);
    }
    // redirigir el usuario a propiedades
    router.push({name: 'admin-propiedades'})
});
</script>

<template>
    <h2 class="text-center text-h3 my-5 font-weight-bold">Editar Propieda</h2>

    <v-card max-width="800" flat class="mx-auto my-10">
        <v-card-title class="mt-5">
            <h1 class="text-h4 font-weight-bold">Editar Propiedad</h1>
        </v-card-title>
        
        <v-card-subtitle > 
            <p class="text-h5">Edita los detalles de la propiedad</p>
        </v-card-subtitle>

        <v-form class="mt-10">
            <v-text-field
                v-model="titulo.value.value"
                :error-messages="titulo.errorMessage.value"
                label="Titulo"
                class="mb-5"
                prepend-icon="mdi-home"
            ></v-text-field>

            <v-file-input
                v-model="imagen.value.value"
                :error-messages="imagen.errorMessage.value"
                accept="image/jpeg"
                prepend-icon="mdi-camera"
                label="Fotografía"
                class="mb-5"
                @change="uploadImage"
                
            ></v-file-input>

            <div class="my-5 d-flex align-center flex-column">
                <p class="font-weight-bold">Imagen Actual:</p>

                <img 
                    v-if="image"
                    class="w-50"
                    :src="image" 
                    alt="imagen-actual-editar"
                />

                <img 
                    v-else
                    class="w-50"
                    :src="propiedad?.imagen" 
                    alt="imagen-actual-editar"
                />
            </div>


            <v-text-field
                v-model="precio.value.value"
                :error-messages="precio.errorMessage.value"
                label="Precio"
                class="mb-5"
                prepend-icon="mdi-currency-usd"
            ></v-text-field>

            <v-row>
                <v-col
                    cols="12"
                    md="4"
                >
                    <v-select 
                        label="Habitaciones"
                        prepend-icon="mdi-door"
                        class="mb-5"
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
                        prepend-icon="mdi-toilet"
                        label="WC"
                        class="mb-5"
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
                        prepend-icon="mdi-car"
                        label="Lugares Estacionamiento"
                        class="mb-5"
                        :items="items"
                        v-model="estacionamiento.value.value"
                        :error-messages="estacionamiento.errorMessage.value"
                    />
                </v-col>
            </v-row>

            <v-textarea
                v-model="descripcion.value.value"
                :error-messages="descripcion.errorMessage.value"
                label="Descripción"
                prepend-icon="mdi-text-box-outline"
                class="mb-5"
            ></v-textarea>

            <v-checkbox 
                v-model="alberca.value.value"
                label="Alberca"
            ></v-checkbox>


            <h2 class="font-weight-bold text-center my-5">Ubicación</h2>
            <div class="pb-10">
                <div style="height:600px">
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
                color="pink-accent-3"
                block
                @click="submit"
            >
                Guardar Cambios
            </v-btn>
        </v-form>
    </v-card>
</template>
