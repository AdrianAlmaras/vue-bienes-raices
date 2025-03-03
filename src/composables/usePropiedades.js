import { computed, ref } from "vue";
import { collection, doc, deleteDoc } from "firebase/firestore";
import { ref as storageRef, deleteObject } from "firebase/storage";
import { useFirestore, useCollection, useFirebaseStorage } from "vuefire";

export default function usePropiedades() {
    const alberca = ref(false);
    
    const storage = useFirebaseStorage()
    // Conexión a fire
    const db = useFirestore();
    // get de propiedades
    const propiedadesCollection = useCollection(collection(db, 'propiedades'));

    async function deleteItem(id, urlImage) {
        //console.log(id);
        if(confirm('¿Deseas eliminar esta propiedad?')) {
            const docRef = doc(db, 'propiedades', id);
            // referencia ala img a eliminar
            const imageRef = storageRef(storage, urlImage)

            // para que se ejecuten al mismo tiempo
            // eliminamos un documento y un archivo
            await Promise.all([
                 deleteDoc(docRef),
                 deleteObject(imageRef)
            ])

            
        }

    }

    const propiedadesFiltradas = computed(() => {
        return alberca.value ?
        propiedadesCollection.value.filter(propiedad => propiedad.alberca):
        propiedadesCollection.value
    })

    
    return {
        deleteItem,
        propiedadesCollection,
        propiedadesFiltradas,
        alberca
    }
}