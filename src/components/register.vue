<template>
    <div>
        <el-container>
            <el-header height="40px">
                <i style="float: right;margin-top: 10px" class="el-icon-info"></i>
                <h5 style="margin: 0 auto;line-height: 40px;">挂号预约</h5>
            </el-header>
            <el-header>
                <el-input
                        placeholder="搜索科室"
                        v-model="search">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
            </el-header>
            <el-container>
                <el-aside width="30%">
                    <el-menu :default-active="active" background-color="#F3F4F6" v-for="(department,i) in departments"
                             :key="i">
                        <el-menu-item :index="department.departmentId.toString()"
                                      @click="getUser(department.departmentId)">
                            <span slot="title">{{department.departmentName}}</span>
                        </el-menu-item>
                    </el-menu>
                </el-aside>
                <el-main v-loading="dataListLoading">
                    <el-row :gutter="10">
                        <div class="block" v-for="(user,i) in users" :key="i" @click="drawer=true">
                            <el-col :xs="12" :sm="8" :md="8" >
                                <el-image :src="user.photoUrl" fit="fill">
                                    <div slot="error" class="image-slot">
                                        <i class="el-icon-picture-outline"></i>
                                    </div>
                                </el-image>
                                <span class="demonstration">{{user.username}}</span>
                            </el-col>
                        </div>
                    </el-row>
                </el-main>
            </el-container>
        </el-container>
        <el-drawer
                title="我是标题"
                :visible.sync="drawer"
                :with-header="false"
                size="100%">
            <registrationDetails ref="registrationDetails" :go-back="goBack"></registrationDetails>
        </el-drawer>
    </div>
</template>

<script>
    import registrationDetails from "./registration-details"

    export default {
        data() {
            return {
                departments: [],
                users: [],
                dataListLoading: false,
                search: '',
                active: '',
                drawer: false
            }
        },
        created() {
            this.init()
        },
        components: {
            registrationDetails
        },
        methods: {
            init() {
                this.dataListLoading = true
                this.$http({
                    url: this.$http.adornUrl('/users_department/Department/allDepartment'),
                    method: 'get'
                }).then(({data}) => {
                    if (data && data.code === 200) {
                        this.departments = data.departments
                        this.active = data.departments[0].departmentId + ''
                        this.users = data.users
                        console.log(this.departments)
                        console.log(this.users)
                    } else {
                        this.departments = [],
                            this.users = []
                    }
                    this.dataListLoading = false
                })
            },
            getUser(did) {
                this.active = did + ''
                this.dataListLoading = true
                this.users = []
                this.$http({
                    url: this.$http.adornUrl('/users_department/Department/getUser'),
                    method: 'post',
                    params: this.$http.adornParams({
                        'did': did
                    })
                }).then(({data}) => {
                    if (data && data.code === 200) {
                        this.users = data.users
                    } else {
                        this.users = []
                    }
                    this.dataListLoading = false
                })
            },
            goBack(){
                this.drawer=false
            }
        }
    };
</script>

<style>
    body {
        margin: 0;
        background-color: #F3F4F6;
        color: #333;
        text-align: center;
    }

    .el-menu-item {
        border-left: 1px solid #E9EEF3;
        border-bottom: 1px solid #E9EEF3;
    }

    .el-main {
        border-bottom: 1px solid #E9EEF3;
        border-top: 1px solid #E9EEF3;
    }

    .el-menu {
        border-top: 1px solid #E9EEF3;
    }

    .demonstration {
        color: #8492a6;
        font-size: 14px;
    }
</style>
