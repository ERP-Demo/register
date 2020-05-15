<template>
    <div class="mod-config">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="getDataList()" label-width="90px" style="margin-top: 40px">

            <el-form-item label="名称" prop="patientName">
                <el-input placeholder="患者名称" v-model="dataForm.patientName" style="width: 250px;line-height: 50px"></el-input>
            </el-form-item>

            <el-form-item label="患者性别" prop="patientSex">
                <el-radio-group v-model="dataForm.patientSex" style="width: 250px;line-height: 50px;">
                    <el-radio label="男"></el-radio>
                    <el-radio label="女"></el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="患者年龄" prop="patientAge">
                <el-input placeholder="患者年龄" v-model="dataForm.patientAge" style="width: 250px;line-height: 50px;"></el-input>
            </el-form-item>

            <el-form-item label="身份证" prop="patientCartnum">
                <el-input placeholder="身份证" v-model="dataForm.patientCartnum" style="width: 250px;line-height: 50px"></el-input>
            </el-form-item>

            <el-form-item label="患者电话" prop="patientPhone">
                <el-input placeholder="患者电话" v-model="dataForm.patientPhone" style="width: 173px;line-height: 50px;"></el-input>
                <el-button type="primary" style="margin: 7px;" @click="getImageVerifyCode()">验证码</el-button>
            </el-form-item>

            <el-form-item label="患者地址" prop="patientAddress">
                <el-input placeholder="患者地址" v-model="dataForm.patientAddress" style="width: 250px;line-height: 50px;"></el-input>
            </el-form-item>

            <el-form-item label="科室" prop="departmentId">
                <el-select placeholder="请选择" v-model="dataForm.departmentId" style="width: 250px;line-height: 50px;">
                    <el-option
                            v-for="item in dlist"
                            :key="item.departmentId"
                            :label="item.departmentName"
                            :value="item.departmentId">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="患者备注" prop="patientNote">
                <el-input placeholder="患者备注" v-model="dataForm.patientNote" style="width: 250px;line-height: 50px;"></el-input>
            </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer" style="margin-left: 190px">
            <el-button @click="visible = false">取消</el-button>
            <el-button type="primary" @click="dataFormSubmit()" :disabled="confirmButtonDisabled">确定</el-button>
        </span>

        <img :src="`data:image/png;base64,${Image}`" alt="带抠图阴影的原图">
    </div>
</template>

<script>
    export default {
        name: "registration-details",
        data () {
            return {
                confirmButtonDisabled: false,
                dataForm: {
                    patientName: '',
                    patientSex: '',
                    patientAge: '',
                    patientCartnum: '',
                    patientPhone: '',
                    patientAddress:'',
                    departmentId:'',
                    patientNote:'',
                    registerCost:''
                },
                phones:'',
                dataRule: {
                    patientName: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
                    patientAge: [{ required: true, message: '年龄不能为空', trigger: 'blur' }],
                    patientSex: [{ required: true, message: '性别不能为空', trigger: 'blur' }],
                    patientPhone: [{ required: true, message: '电话不能为空', trigger: 'blur' }],
                    patientAddress: [{ required: true, message: '地址不能为空', trigger: 'blur' }],
                    patientNote: '',
                    registerCost: [{ required: true, message: '挂号费用不能为空', trigger: 'blur' }],
                    departmentId: [{ required: true, message: '科室不能为空', trigger: 'blur' }],
                    patientCartnum:[{ required: true, message: '身份证不能为空', trigger: 'blur' }]
                },
                drugsList: [],
                image: ''
            }
        },
        activated () {
            this.getDataList()
        },
        methods: {
            // 获取数据列表
            getDataList () {
                this.dataListLoading = true
                this.$http({
                    url: this.$http.adornUrl('/drugs/reports/selectDrugsId'),
                    method: 'get'
                }).then(({data}) => {
                    if (data && data.code === 200) {
                        this.drugsList = data.list
                        console.log("aaa"+this.drugsList)
                    } else {
                        this.$message.error(data.msg)
                    }
                })
            },
            dataFormSubmit(){
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
                        this.dataForm.drugsId="",
                            this.dataForm.reportedLossCount="",
                            this.dataForm.reportedLossWhy="",
                            this.dataForm.reportedLossNote="",
                            this.dataForm.reportedLossOperationOf=""
                        /*跳转页面*/
                        this.$router.replace({ name: 'drugs-all-storage-report' })
                    } else {
                        this.$message.error(data.msg)
                    }
                })
            },
            getImageVerifyCode(){
                this.$http({
                    url: this.$http.adornUrl('/register/register/getImageVerifyCode'),
                    method: 'get'
                }).then(({data}) => {
                    if (data && data.code === 200) {
                        this.image = data.bigImage
                    } else {
                        this.users = []
                    }
                    this.dataListLoading = false
                })
            },
            //验证码
            VerificationCode(){
                this.phones=this.dataForm.patientPhone;
                console.log(this.phones)
                this.$http({
                    url: this.$http.adornUrl('/register/register/VerificationCode'),
                    method: 'post',
                    params: this.$http.adornParams({
                        'phones':this.phones
                    })
                }).then(({data}) => {
                    if (data && data.code === 200) {
                        this.users = data.users
                    } else {
                        this.users = []
                    }
                    this.dataListLoading = false
                })
            }
        }
    }
</script>

<style scoped>

</style>