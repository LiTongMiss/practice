export function checkArray(key) {
    // 权限数组
    let arr = ['1','2','3','4','5']
    let index = arr.indexOf(key)

    if(index> -1) {
        return true
    } else {
        return false
    }
}