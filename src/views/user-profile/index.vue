<template>
  <div class="user-profile">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" title="个人信息" left-arrow @click-left="$router.back()"/>
    <!-- /导航栏 -->

    <!-- 这个是选择文件上传，hidden是把其隐藏起来，因为其比较难看 -->
    <input type="file" hidden ref="file" @change="onFileChange">

    <!-- 个人信息 -->
    <van-cell title="头像" is-link @click="$refs.file.click()">
      <van-image class="avatar" fit="cover" round :src="user.photo"/>
    </van-cell>
    <van-cell title="昵称" :value="user.name" is-link @click="isUpdateNameShow = true"/>
    <van-cell
      title="性别"
      :value="user.gender === 0 ? '男' : '女'"
      is-link
      @click="isUpdateGenderShow = true"
    />
    <van-cell title="生日" @click="isUpdateBirthdayShow = true" :value="user.birthday" is-link/>
    <!-- /个人信息 -->

    <!-- 编辑昵称弹层 -->
    <van-popup v-model="isUpdateNameShow" style="height:100%;" position="bottom">
      <update-name v-if="isUpdateNameShow" v-model="user.name" @close="isUpdateNameShow = false"/>
    </van-popup>
    <!-- /编辑昵称弹层 -->

    <!-- 编辑性别 -->
    <van-popup v-model="isUpdateGenderShow" position="bottom">
      <update-gender
        v-if="isUpdateGenderShow"
        @close="isUpdateGenderShow = false"
        v-model="user.gender"
      />
    </van-popup>
    <!-- /编辑性别 -->

    <!-- 编辑生日 -->
    <van-popup v-model="isUpdateBirthdayShow" position="bottom">
      <update-birthday
        v-if="isUpdateBirthdayShow"
        v-model="user.birthday"
        @close="isUpdateBirthdayShow = false"
      />
    </van-popup>
    <!-- /编辑生日 -->

    <!-- 编辑头像 -->
    <van-popup v-model="isUpdatePhotoShow" position="bottom" style="height:100%;">
      <update-photo
        :img="img"
        @close="isUpdatePhotoShow = false"
        @update-photo="user.photo = $event"
        v-if="isUpdatePhotoShow"
      />
    </van-popup>
    <!-- /编辑头像 -->
  </div>
</template>

<script>
import { getUserProfile } from "@/api/user";
import UpdateName from "./components/update-name";
import UpdateGender from "./components/update-gender";
import UpdateBirthday from "./components/update-birthday";
import UpdatePhoto from "./components/update-photo";

export default {
  name: "UserProfile",
  components: {
    UpdateName,
    UpdateGender,
    UpdateBirthday,
    UpdatePhoto
  },
  data () {
    return {
      user: {}, // 用户的个人信息
      isUpdateNameShow: false, // 控制编辑昵称的弹层显示
      isUpdateGenderShow: false, // 控制编辑性别的弹层显示
      isUpdateBirthdayShow: false, // 控制编辑生日的弹层显示
      isUpdatePhotoShow: false, // 控制编辑头像的弹层显示
      img: null // 预览的图片
    };
  },
  computed: {},
  watch: {},
  methods: {
    async loadUserProfile () {
      try {
        const { data } = await getUserProfile();
        this.user = data.data;
      } catch (err) {
        this.$toast("数据获取失败");
      }
    },
    onFileChange () {
      // 获取文件对象
      const file = this.$refs.file.files[0];
      // 基于文章对象获取 blob 数据
      this.img = window.URL.createObjectURL(file);

      // 选择图片之后，弹层显示出来
      this.isUpdatePhotoShow = true;

      // file-input 如果选了同一个文件不会触发 change 事件
      // 解决方法就是每次使用完毕，把它的 value 清空
      this.$refs.file.value = "";
    }
  },
  created () {
    this.loadUserProfile();
  },
  mounted () {}
};
</script>

<style lang='less' scoped>
.user-profile {
  .avatar {
    width: 60px;
    height: 60px;
  }
  .van-popup {
    background-color: #f5f7f9;
  }
}
</style>
