import {checkArray} from './permission'

Vue.directive('display-key', {
    inserted(el, binding) {
        let displayKey = binding.value
        if(displayKey) {
            let hasPermission = checkArray(displayKey)
            if(hasPermission) {
                el.removElement
            }
        }
    }
})