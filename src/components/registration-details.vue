<template>
    <div class="mod-config">
        <el-page-header @back="callBack" content="详情页面">
        </el-page-header>
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="getDataList()"
                 label-width="90px" style="margin-top: 40px">
            <el-form-item label="姓名" prop="patientName">
                <el-input placeholder="请输入姓名" v-model="dataForm.patientName"
                          style="width: 250px;line-height: 50px"></el-input>
            </el-form-item>

            <el-form-item label="性别" prop="patientSex">
                <el-radio-group v-model="dataForm.patientSex" style="width: 250px;line-height: 50px;">
                    <el-radio label="男"></el-radio>
                    <el-radio label="女"></el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="年龄" prop="patientAge">
                <el-input placeholder="请输入年龄" v-model="dataForm.patientAge"
                          style="width: 250px;line-height: 50px;"></el-input>
            </el-form-item>

            <el-form-item label="电话" prop="patientPhone">
                <el-input placeholder="电话" v-model="dataForm.patientPhone"
                          style="width: 124px;line-height: 50px;"></el-input>
                <el-button type="primary" style="margin: 7px;" @click="getImageVerifyCode()">发送验证码</el-button>
            </el-form-item>

            <el-form-item label="地址" prop="patientAddress">
                <el-input placeholder="请输入地址" v-model="dataForm.patientAddress"
                          style="width: 250px;line-height: 50px;"></el-input>
            </el-form-item>

            <el-form-item label="备注" prop="patientNote">
                <el-input placeholder="请输入备注" v-model="dataForm.patientNote"
                          style="width: 250px;line-height: 50px;"></el-input>
            </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer" style="margin-left: 190px">
            <el-button @click="visible = false">取消</el-button>
            <el-button type="primary" @click="dataFormSubmit()" :disabled="confirmButtonDisabled">确定</el-button>
        </span>
        <el-dialog
                title="滑块验证"
                :visible.sync="dialogVisible"
                width="340px">
            <div style="position: relative" v-loading="loading">
                <div v-if="msg!==''" class="el-loading-mask">
                    <div class="el-loading-spinner">
                        <i :style="`color: ${msg==='success'? '#7ac23c': '#f56c6c'}`"
                           :class="`${msg==='success'? 'el-icon-circle-check': 'el-icon-circle-close'} text`"></i>
                        <span v-if="msg==='success'">本次验证用时：{{time}}S</span>
                    </div>
                </div>
                <img :src="bigImage" alt="验证图">
                <img :style="`top:${top}px;left:${left}px` " class="smallimg" :src="smallImage" alt="请滑动图片">
            </div>
            <slider style="width: 300px" ref="slider" :mouseup-call-back="callBack" :mouse-move-call-back="mousemove"
                    :loading="loading"></slider>
        </el-dialog>
    </div>
</template>

<script>
    import slider from "./slider";

    export default {
        name: "registration-details",
        data() {
            return {
                confirmButtonDisabled: false,
                dataForm: {
                    patientName: '',
                    patientSex: '',
                    patientAge: '',
                    patientCartnum: '',
                    patientPhone: '',
                    patientAddress: '',
                    departmentId: '',
                    patientNote: '',
                    registerCost: ''
                },
                phones: '',
                dataRule: {
                    patientName: [{required: true, message: '名称不能为空', trigger: 'blur'}],
                    patientAge: [{required: true, message: '年龄不能为空', trigger: 'blur'}],
                    patientSex: [{required: true, message: '性别不能为空', trigger: 'blur'}],
                    patientPhone: [{required: true, message: '电话不能为空', trigger: 'blur'}],
                    patientAddress: [{required: true, message: '地址不能为空', trigger: 'blur'}],
                    patientNote: [{required: true, message: '备注不能为空', trigger: 'blur'}],
                    registerCost: [{required: true, message: '挂号费用不能为空', trigger: 'blur'}],
                    departmentId: [{required: true, message: '科室不能为空', trigger: 'blur'}],
                    patientCartnum: [{required: true, message: '身份证不能为空', trigger: 'blur'}]
                },
                drugsList: [],
                bigImage: '',
                smallImage: '',
                loading: false,
                top: '',
                msg: '',
                time:'',
                dialogVisible: false,
                left: 0
            }
        },
        props: {
            goBack: {  //定义一个外来方法
                type: Function, //参数类型：函数
                required: true //是否必填：是
            }
        },
        components: {
            slider
        },
        activated() {
            this.getDataList()
        },
        methods: {
            // 获取数据列表
            getDataList() {
                this.dataListLoading = true
                this.$http({
                    url: this.$http.adornUrl('/drugs/reports/selectDrugsId'),
                    method: 'get'
                }).then(({data}) => {
                    if (data && data.code === 200) {
                        this.drugsList = data.list
                        console.log("aaa" + this.drugsList)
                    } else {
                        this.$message.error(data.msg)
                    }
                })
            },
            dataFormSubmit() {
                this.$http({
                    url: this.$http.adornUrl('/drugs/reports/addStorageReport'),
                    method: 'post',
                    data: this.$http.adornData(this.dataForm)
                }).then(({data}) => {
                    this.confirmButtonDisabled = true
                    if (data && data.code === 200) {
                        this.$message({
                            message: '操作成功',
                            type: 'success',
                            duration: 1000
                        })
                        /*刷新页面*/
                        this.dataForm.drugsId = "",
                            this.dataForm.reportedLossCount = "",
                            this.dataForm.reportedLossWhy = "",
                            this.dataForm.reportedLossNote = "",
                            this.dataForm.reportedLossOperationOf = ""
                        /*跳转页面*/
                        this.$router.replace({name: 'drugs-all-storage-report'})
                    } else {
                        this.$message.error(data.msg)
                    }
                })
            },
            getImageVerifyCode() {
                this.loading = true
                this.$http({
                    url: this.$http.adornUrl('/register/register/getImageVerifyCode'),
                    method: 'get'
                }).then(({data}) => {
                    if (data && data.code === 200) {
                        this.bigImage = 'data:image/png;base64,' + data.bigImage
                        this.smallImage = 'data:image/png;base64,' + data.smallImage
                        this.dialogVisible = true
                        this.top = data.yHeight
                        this.$cookie.set('uuid', data.uuid)
                        this.loading = false
                    } else {
                        this.users = []
                    }
                })
            },
            callBack(width) {
                this.loading = true
                this.$http({
                    url: this.$http.adornUrl('/register/register/verifyImageCode'),
                    method: 'get',
                    params: this.$http.adornParams({
                        'moveLength': width,
                        'uuid': this.$cookie.get('uuid')
                    })
                }).then(({data}) => {
                    this.msg = data.msg
                    if (data.code === 200) {
                        this.time = (300000-data.time)/1000
                        this.$refs.slider.successFunction()
                    } else {
                        this.$refs.slider.failureFunction()
                        setTimeout(()=>{
                            this.$refs.slider.info()
                            this.msg=''
                            this.left = 0
                            this.getImageVerifyCode()
                        },1000)
                    }
                    this.loading = false
                })
            },
            mousemove(width) {
                this.left = width
            },
            callBack(){
                this.$props.goBack()
            }
        }
    }
</script>

<style>
    .smallimg {
        touch-action: none;
        position: absolute;
        left: 0;
        top: 20px;
        width: 50px;
    }

    @keyframes fade-in {
        0% {
            opacity: 0;
        }
        /*初始状态 透明度为0*/
        40% {
            opacity: 0;
        }
        /*过渡状态 透明度为0*/
        100% {
            opacity: 1;
        }
        /*结束状态 透明度为1*/
    }

    @-webkit-keyframes fade-in { /*针对webkit内核*/
        0% {
            opacity: 0;
        }
        40% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }

    .text {
        animation: fade-in; /*动画名称*/
        animation-duration: .5s; /*动画持续时间*/
        -webkit-animation: fade-in .5s; /*针对webkit内核*/
        font-size: 40px;
        opacity: 1;
    }

</style>
