<template>
    <div class="drag" ref="dragDiv" v-loading="loading">
        <div :style="`background-color:${confirmWords==='验证失败'? '#F56C6C':'#7ac23c'}`" class="drag_bg"></div>
        <div class="drag_text">{{confirmWords}}</div>
        <div ref="moveDiv" @mousedown="mouseDownFn($event)"
             :class="`${confirmWords==='向右拖动滑块验证'?'handler_bg':''} handler`" style="position: absolute;top: -1px;left: 0px;">
            <i v-if="confirmWords!='向右拖动滑块验证'" :style="`color: ${confirmWords==='验证失败'? '#f56c6c':'#7ac23c'};font-size: 20px`" :class="`${confirmWords==='验证失败'? 'el-icon-circle-close': 'el-icon-circle-check'}`"></i>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                beginClientX: 0,           /*距离屏幕左端距离*/
                mouseMoveState: false,     /*触发拖动状态  判断*/
                maxWidth: '',               /*拖动最大宽度，依据滑块宽度算出来的*/
                confirmWords: '向右拖动滑块验证',   /*滑块文字*/
                confirmSuccess: false,           /*验证成功判断*/
                mouseMoving: false
            }
        },
        props: {
            mouseupCallBack: {  //定义一个外来方法
                type: Function, //参数类型：函数
                required: true //是否必填：是
            },
            mouseMoveCallBack: {  //定义一个外来方法
                type: Function, //参数类型：函数
                required: true //是否必填：是
            },
            loading: {
                type: Boolean,
                default: false
            },
        },
        methods: {
            //mousedown 事件
            mouseDownFn: function (e) {
                if (!this.confirmSuccess) {
                    e.preventDefault && e.preventDefault();   //阻止文字选中等 浏览器默认事件
                    this.mouseMoveState = true;
                    this.beginClientX = e.clientX;
                }
            },
            info(){
                this.confirmWords= '向右拖动滑块验证'
                this.confirmSuccess= false
                this.mouseMoving= false
                document.getElementsByClassName('handler')[0].style.left = 0 + 'px';
                document.getElementsByClassName('drag_bg')[0].style.width = 0 + 'px';
            },
            //验证成功函数
            successFunction() {
                this.confirmSuccess = true;
                this.confirmWords = '验证通过';
                document.getElementsByClassName('drag_text')[0].style.color = '#fff';
                document.getElementsByClassName('handler')[0].style.left = this.maxWidth + 'px';
                document.getElementsByClassName('drag_bg')[0].style.width = this.maxWidth + 'px';
            },
            //验证成功函数
            failureFunction() {
                this.confirmSuccess = true
                this.confirmWords = '验证失败'
                document.getElementsByClassName('drag_text')[0].style.color = '#fff';
                document.getElementsByClassName('handler')[0].style.left = this.maxWidth + 'px';
                document.getElementsByClassName('drag_bg')[0].style.width = this.maxWidth + 'px';
            },
            //mousemove事件
            mouseMoveFn(e) {
                if (this.mouseMoveState) {
                    this.mouseMoving=true
                    let width = e.clientX - this.beginClientX;
                    if (width > 0 && width <= this.maxWidth) {
                        this.$props.mouseMoveCallBack(width)
                        document.getElementsByClassName('handler')[0].style.left = width + 'px';
                        document.getElementsByClassName('drag_bg')[0].style.width = width + 'px';
                    }
                }
            },
            //mouseup事件
            moseUpFn(e) {
                this.mouseMoveState = false;
                if (!this.mouseMoving) return
                else this.mouseMoving=false
                var width = e.clientX - this.beginClientX
                if (width < this.maxWidth) {
                    this.$props.mouseupCallBack(width)
                    document.getElementsByClassName('handler')[0].style.left = 0 + 'px';
                    document.getElementsByClassName('drag_bg')[0].style.width = 0 + 'px';
                }
            }
        },
        mounted() {
            this.maxWidth = this.$refs.dragDiv.clientWidth - this.$refs.moveDiv.clientWidth;
            document.getElementsByTagName('html')[0].addEventListener('mousemove', this.mouseMoveFn);
            document.getElementsByClassName('drag')[0].addEventListener('mouseup', this.moseUpFn)
        }
    }
</script>
<style scoped>
    .drag {
        position: relative;
        background-color: #e8e8e8;
        width: 100%;
        height: 40px;
        line-height: 40px;
        text-align: center;
        border: 1px solid #ccc;
        border-radius: 4px;
    }

    .handler {
        width: 40px;
        height: 40px;
        border: 1px solid #ccc;
        border-radius: 4px;
        cursor: move;
        background: #fff
    }

    .handler_bg {
        background:#fff url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo0ZDhlNWY5My05NmI0LTRlNWQtOGFjYi03ZTY4OGYyMTU2ZTYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NTEyNTVEMURGMkVFMTFFNEI5NDBCMjQ2M0ExMDQ1OUYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NTEyNTVEMUNGMkVFMTFFNEI5NDBCMjQ2M0ExMDQ1OUYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo2MTc5NzNmZS02OTQxLTQyOTYtYTIwNi02NDI2YTNkOWU5YmUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NGQ4ZTVmOTMtOTZiNC00ZTVkLThhY2ItN2U2ODhmMjE1NmU2Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+YiRG4AAAALFJREFUeNpi/P//PwMlgImBQkA9A+bOnfsIiBOxKcInh+yCaCDuByoswaIOpxwjciACFegBqZ1AvBSIS5OTk/8TkmNEjwWgQiUgtQuIjwAxUF3yX3xyGIEIFLwHpKyAWB+I1xGSwxULIGf9A7mQkBwTlhBXAFLHgPgqEAcTkmNCU6AL9d8WII4HOvk3ITkWJAXWUMlOoGQHmsE45ViQ2KuBuASoYC4Wf+OUYxz6mQkgwAAN9mIrUReCXgAAAABJRU5ErkJggg==") no-repeat center;
    }

    .drag_bg {
        height: 40px;
        width: 0px;
        border-radius: 4px 0 0 4px;
    }

    .drag_text {
        position: absolute;
        top: 0px;
        width: 100%;
        text-align: center;
        -moz-user-select: none;
        -webkit-user-select: none;
        user-select: none;
        -o-user-select: none;
        -ms-user-select: none;
    }
</style>
