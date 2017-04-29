import * as THREE from 'three';


function createColorscale() {
    
    const colorScaler = function(value){
        
        const purple = new THREE.Color("rgb(127, 0, 255)")
        purple.multiplyScalar(value)
        
        //console.log(purple)
        return purple.getHex();
    }
    
    return colorScaler;
   
}

module.exports = createColorscale