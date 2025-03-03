import { computed } from 'vue';
import { ref as storageRef } from "firebase/storage";
import { useFirebaseStorage, useStorageFile } from "vuefire";
import { uid } from "uid";


export default function useImage(){
    // registrar o le decimos q servicio vamos a utilizar 
    const storage = useFirebaseStorage();
    // identifica nuestras credenciales, donde lo va a guardar
    const storageRefPath = storageRef(storage, `/propiedades/${uid()}`)

    const {
        url,
        uploadProgress,
        uploadError,
        uploadTask,
        upload

    } = useStorageFile(storageRefPath);

    // se ejecuta cuando se sube un file en el formulario
    function uploadImage(e) {
        //console.log(e.target.files[0]);
        const data = e.target.files[0];
        if(data) {
            upload(data);
        }
        //console.log(url);
    }

    const image = computed(() => {
        return url.value ? url.value: null;
    })

    return {
        uploadImage,
        image,
        url
    }
};