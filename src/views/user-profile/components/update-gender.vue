<template>
  <div class="update-gender">
    <van-picker
      title="性别"
      show-toolbar
      :default-index="value"
      :columns="columns"
      @cancel="$emit('close')"
      @confirm="onConfirm"
      @change="onPickChange"
    />
  </div>
</template>

<script>
import { updateUserProfile } from "@/api/user";

export default {
  name: "UpdateGender",
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      columns: ["男", "女"],
      localGender: this.value
    };
  },
  computed: {},
  watch: {},
  methods: {
    async onConfirm () {
      this.$toast.loading({
        message: "保存中...",
        forbidClick: true, // 禁止背景点击
        duration: 0 // 持续展示
      });
      try {
        const localGender = this.localGender;

        await updateUserProfile({
          gender: localGender
        });

        // 更新视图
        this.$emit("input", localGender);
        // 关闭弹层
        this.$emit("close");
        // 提示成功
        this.$toast.success("更新成功");
      } catch (err) {
        this.$toast.fail("更新失败");
      }
    },
    onPickChange (picker, value, index) {
      this.localGender = index;
    }
  },
  created () {},
  mounted () {}
};
</script>

<style lang='less' scoped>
</style>
