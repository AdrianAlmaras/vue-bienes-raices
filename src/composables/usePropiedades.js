import { computed } from "vue";
import { collection } from "firebase/firestore";
import { useFirestore, useCollection } from "vuefire";

export default function usePropiedades() {
    
    // Conexión a fire
    const db = useFirestore();
    // get de propiedades
    const propiedadesCollection = useCollection(collection(db, 'propiedades'));

    // Formato a precio
    const priceProperty = computed(() => {

        return (price) => 
            //console.log(price);
            Number(price).toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD'
            })
        
    });

    return {
        propiedadesCollection,
        priceProperty
    }
}