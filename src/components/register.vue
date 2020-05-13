<template>
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
                <el-menu default-active="1"  @select="getdocter" background-color="#F3F4F6" v-for="department in departments" :key="department">
                    <el-menu-item index="1">
                        <span slot="title">{{department.departmentName}}</span>
                    </el-menu-item>
                </el-menu>
            </el-aside>
            <el-main v-loading="dataListLoading">
                <el-row :gutter="10">
                    <div class="block" v-for="user in users" :key="user">
                        <el-col :xs="12" :sm="8" :md="8">
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
</template>

<script>
    export default {
        data() {
            return {
                departments:[],
                users:[],
                dataListLoading: false,
                search:'',
            }
        },
        created() {
            this.init()
        },
        methods: {
            init(){
                this.$http({
                    url: this.$http.adornUrl('/users_department/Department/allDepartment'),
                    method: 'get'
                }).then(({data}) => {
                    if (data && data.code === 200) {
                        this.departments = data.departments
                        this.users = data.users
                    } else {
                        this.departments = [],
                        this.users = []
                    }
                    this.dataListLoading = false
                })
            },
            getUser(did){
                this.users=[]
                this.$http({
                    url: this.$http.adornUrl('/users_department/Department/getUser'),
                    method: 'post',
                    params: this.$http.adornParams({
                        'did':did
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
    .el-main{
        border-bottom: 1px solid #E9EEF3;
        border-top: 1px solid #E9EEF3;
    }
    .el-menu{
        border-top: 1px solid #E9EEF3;
    }
    .demonstration {
        color: #8492a6;
        font-size: 14px;
    }
</style>
