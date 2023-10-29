<template>
  <div id="body">
    <el-form label-position="left" label-width="50%">
      <el-form-item :label="$t('userInfo.avatar.original')">
        <el-avatar :size="200" :src="originalAvatar" />
      </el-form-item>
      <label id="uploadBtn" for="uploads">
        {{ $t("userInfo.avatar.clickUpload") }}
      </label>
      <input
        type="file"
        id="uploads"
        style="position: absolute; clip: rect(0 0 0 0)"
        accept="image/bmp, image/png, image/jpeg, image/jpg, image/gif"
        @change="uploadImg($event)"
      />
      <div id="cropper">
        <vueCropper ref="cropper" v-bind="option"></vueCropper>
      </div>
    </el-form>
    <el-button type="primary" @click="saveAvatar">
      {{ $t("userInfo.avatar.save") }}
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { VueCropper } from "vue-cropper";
import { useI18n } from "vue-i18n";
import axios from "axios";
import "vue-cropper/dist/index.css";
import router from "../../router";

const originalAvatar = ref("");

const option = reactive({
  img: "",
  size: 0,
  outputType: "png",
  fixedBox: false,
  autoCrop: true,
  autoCropWidth: 200,
  autoCropHeight: 200,
  high: false,
  cropData: {},
  limitMinSize: [50, 50],
  fixed: true,
  fixedNumber: [1, 1],
});

const { t } = useI18n();
const cropper = ref(null as VueCropper);
const newAvatar = ref(new Blob());

function uploadImg(event: any) {
  const file = event.target.files[0];
  if (
    !/\.(bmp|gif|jpg|jpeg|png|BMP|GIF|JPG|JPEG|PNG)$/.test(event.target.value)
  )
    ElMessage.error(t("register.avatarTypeErr"));

  const reader = new FileReader();
  reader.onload = (event) => {
    let data: string;
    if (typeof event.target?.result === "object" && event.target?.result) {
      data = window.URL.createObjectURL(new Blob([event.target?.result]));
      option.img = data;
    }
  };

  reader.readAsArrayBuffer(file);
  ElMessage.success(t("register.avatarUploadSuccess"));
}

function saveAvatar() {
  cropper?.value?.getCropBlob((data: Blob) => {
    newAvatar.value = data;
  });

  axios
    .post("/api/profile/avatar", newAvatar.value, {
      headers: { "Content-Type": "image/png" },
    })
    .then(() => {
      ElMessage.success(t("userInfo.avatar.successPrompt"));
      router.push("/");
    })
    .catch((error) => {
      console.log(error);
      ElMessage.error(t("userInfo.avatar.errPrompt"));
    });
}
</script>

<style scoped>
#body {
  margin-left: 2em;
  margin-right: 2em;
  margin-top: 2em;
}

#cropper {
  width: 300px;
  height: 300px;
  margin: auto auto;
  margin-bottom: 1em;
}

#uploadBtn {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #fff;
  border: 1px solid #c0ccda;
  color: #1f2d3d;
  text-align: center;
  box-sizing: border-box;
  outline: none;

  margin-top: 18px;
  margin-bottom: 18px;
  padding: 9px 15px;

  font-size: 14px;
  border-radius: 4px;
  color: #fff;
  background-color: #409eff;
  border-color: #409eff;
  transition: all 0.2s ease;
  text-decoration: none;
  user-select: none;
}
</style>
