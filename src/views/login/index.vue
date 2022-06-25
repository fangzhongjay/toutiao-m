<template>
  <div class="login-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" title="登录">
      <!-- 小图标 x -->
      <van-icon name="cross" slot="left" @click="$router.back()"/>
    </van-nav-bar>

    <!-- 登录表单 -->
    <van-form ref="loginForm" @submit="onSubmit">
      <!--当表单内的按钮按下，就会触发该事件-->
      <!-- 表单验证：
        1、给 van-field 组件配置 rules 验证规则
        2、当表单提交的时候回自动触发表单验证
           如果验证通过，会触发 submit 事件
           如果验证失败，不会触发 submit 事件
        3、type="number" 让其只能输入数字
           maxlength="6" 让其最大长度为6位
      -->
      <van-field
        v-model="user.mobile"
        name="mobile"
        placeholder="请输入手机号"
        :rules="userFormRules.mobile"
        type="number"
        maxlength="11"
      >
        <i slot="left-icon" class="toutiao toutiao-shouji"></i>
      </van-field>
      <van-field
        @click="onSendSms"
        v-model="user.code"
        name="code"
        placeholder="请输入验证码"
        :rules="userFormRules.code"
        type="number"
        maxlength="6"
      >
        <i slot="left-icon" class="toutiao toutiao-yanzhengma"></i>
        <template #button>
          <!-- time：倒计时时间,format 是时间格式，ss 是格式，后面的 s是单位 -->
          <van-count-down
            v-if="isCountDownShow"
            :time="1000*60"
            format="ss s"
            @finish="isCountDownShow = false"
          />
          <van-button
            v-else
            native-type="button"
            class="send-sms-btn"
            round
            size="small"
            type="default"
          >获取验证码</van-button>
        </template>
      </van-field>
      <div class="login-btn-wrap">
        <van-button class="login-btn" block type="info" native-type="submit">登录</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { login, sendSms } from "@/api/user";
export default {
  name: "LoginIndex",
  data () {
    return {
      user: {
        mobile: "13911111111", // 手机号
        code: "246810" // 验证码
      },
      // 表单验证规则
      userFormRules: {
        mobile: [
          { required: true, message: "手机号不能为空" },
          { pattern: /^1[3|5||7|8]\d{9}$/, message: "手机号格式错误" } // 以1 开头，第二位为3/5/7/8 ,后面再接9位
        ],
        code: [
          { required: true, message: "验证码不能为空" },
          { pattern: /^\d{6}$/, message: "验证码格式错误" }
        ]
      },
      isCountDownShow: false // 是否展示倒计时
    };
  },
  computed: {},
  watch: {},
  methods: {
    async onSubmit () {
      // 1、获取表单数据
      // const user = this.user;

      // 2、表单验证
      // 在组件中必须通过 this.$toast 来调用Toast组件
      // （新的toast被调用，会把之前的关闭，也就是说当登录成功或失败时，加载转圈会自动消失）
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true, // 禁用背景点击
        duration: 0 // 持续时间，默认是 2000, 如果是 0 则持续展示
      });

      // 3、提交表单请求登录
      try {
        const { data } = await login(this.user);
        this.$store.commit("setUser", data.data);
        this.$toast.success("登录成功！");
        // 登录成功之后，返回上一个页面，从哪来回哪去
        this.$router.back();
      } catch (err) {
        if (err.response.status === 400) {
          this.$toast.fail("手机号或验证码错误");
        } else {
          this.$toast.fail("登录失败，请稍后重试");
        }
      }
      // 4、根据请求响应结果处理后续操作
    },
    async onSendSms () {
      // 1、校验手机号
      try {
        // 不传参是整个表单都验证
        await this.$refs.loginForm.validate("mobile");
      } catch (err) {
        return console.log("验证失败", err);
      }

      // 2、验证通过，显示倒计时
      this.isCountDownShow = true;

      // 3、请求发送验证码
      try {
        await sendSms(this.user.mobile);
        this.$toast("发送成功");
      } catch (err) {
        this.isCountDownShow = false;
        if (err.response.status === 429) {
          this.$toast(`发送太频繁了,请稍后重试`);
        } else {
          this.$toast("发送失败，请稍后重试");
        }
      }
    }
  }
};
</script>

<style lang='less' scoped>
.login-container {
  .toutiao {
    font-size: 37px;
  }
  .send-sms-btn {
    // width: 152px;
    height: 46px;
    line-height: 46px;
    background-color: #ededed;
    font-size: 22px;
    color: #666;
  }
  .login-btn-wrap {
    padding: 53px 33px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
    }
  }
}
</style>
