<script>
export default {
    props: {
        type: {
            type: String,
            defalut: 'normal'
        },
        text: {
            type: String,
            defalut: 'normal'
        }
    },
    render(h) {
        return h('button', {
            // v-bind:class
            btn: true,
            'btn-success': this.type === 'success',
            'btn-danger': this.type === 'danger',
            domProps: {
                innerText: this.text || ''
            }
        })
    },
}
</script>
<style lang="less">
    .btn-success{
        color: green
    }
    .btn-danger{
        color: red
    }
</style>
