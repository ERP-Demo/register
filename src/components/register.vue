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
                <el-menu default-active="1" background-color="#F3F4F6">
                    <el-menu-item index="1">
                        <span slot="title">导航一</span>
                    </el-menu-item>
                    <el-menu-item index="2">
                        <span slot="title">导航二</span>
                    </el-menu-item>
                    <el-menu-item index="3">
                        <span slot="title">导航三</span>
                    </el-menu-item>
                    <el-menu-item index="4">
                        <span slot="title">导航四</span>
                    </el-menu-item>
                    <el-menu-item index="5">
                        <span slot="title">导航五</span>
                    </el-menu-item>
                    <el-menu-item index="6">
                        <span slot="title">导航六</span>
                    </el-menu-item>
                    <el-menu-item index="7">
                        <span slot="title">导航七</span>
                    </el-menu-item>
                </el-menu>
            </el-aside>
            <el-main>
                <el-row :gutter="10">
                    <div class="block" v-for="fit in fits" :key="fit">
                        <el-col :xs="12" :sm="8" :md="8">
                            <el-image :src="url" fit="fill">
                                <div slot="error" class="image-slot">
                                    <i class="el-icon-picture-outline"></i>
                                </div>
                            </el-image>
                            <span class="demonstration">test</span>
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
                fits: ['fill', 'contain', 'cover', 'none', 'scale-down'],
                url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
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
