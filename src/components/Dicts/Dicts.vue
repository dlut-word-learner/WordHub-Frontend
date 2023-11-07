<template>
  <el-container id="selectDictContainer">
    <el-aside :width="sideWidth" class="elAside">
      <el-menu
        @select="onSelectLang"
        default-active="all"
        :background-color="'rgba(255,255,255,0)'"
      >
        <el-menu-item :index="'all'" class="menu-item">
          <div>{{ $t(`dict.all`) }}</div>
        </el-menu-item>
        <el-menu-item
          v-for="abbr in Object.values(Lang)"
          :index="abbr"
          class="menu-item"
        >
          <div>{{ $t(`dict.${abbr}`) }}</div>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main class="dictsMain">
      <el-row class="dictRow" :gutter="10">
        <TransitionGroup name="dictsTrans">
          <el-col
            v-for="(dict, index) in displayedDicts()"
            :key="dict.id"
            :span="8"
          >
            <el-card
              class="dictCard"
              :class="{ dictCard1: index % 2 == 0, dictCard2: index % 2 == 1 }"
            >
              <template #header>
                <div>
                  <div class="dictName">{{ dict.name }}</div>
                  <div class="dictLang">{{ dict.language }}</div>
                </div>
              </template>
              <el-button @click="tryTask(dict, Task.Learn)" class="taskButton">
                {{ $t("dict.learn") }}
              </el-button>
              <el-button @click="tryTask(dict, Task.Review)" class="taskButton">
                {{ $t("dict.review") }}
              </el-button>
              <el-button
                @click="tryTask(dict, Task.QwertyMode)"
                class="taskButton"
              >
                {{ $t("dict.qwertyMode") }}
              </el-button>
            </el-card>
          </el-col>
        </TransitionGroup>
      </el-row>
      <el-footer id="footer">
        <el-pagination
          v-model:current-page="currPage"
          :page-size="pageSize"
          :total="selectedDicts().length"
          :background="true"
          id="pagination"
        />
      </el-footer>
    </el-main>
  </el-container>
  <router-view></router-view>
  <div class="a">
    <div class="b"></div>
    <div class="c"></div>
    <div class="d"></div>
    <div class="e"></div>

    <div id="body" type="flex">
      <img src="/wordhub.png" width="100" height="100" />
      <h2 class="f">{{ $t("login.userLogin") }}</h2>
      <el-form label-width="auto">
        <el-form-item :label="$t('login.username')">
          <el-input type="text" id="username" v-model="form.username" />
        </el-form-item>
        <el-form-item :label="$t('login.password')">
          <el-input
            type="password"
            id="password"
            v-model="form.password"
            :show-password="true"
          />
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="login">{{
        $t("login.login")
      }}</el-button>
      <el-button @click="router.push('/register')">
        {{ $t("login.register") }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { UserVo, useLoginStore } from "../store/loginStore";
import { useI18n } from "vue-i18n";
import router from "../router";
import sha3 from "crypto-js/sha3";
import axios from "axios";

const { t } = useI18n();

const form = reactive({
  username: "",
  password: "",
});

const loginStore = useLoginStore();

function login(): void {
  if (form.username == "" || form.password == "") {
    ElMessage.info(t("login.inputPrompt"));
    return;
  }

  const hash = sha3(form.password).toString();

  axios
    .post(
      "/api/session",
      { username: form.username, password: hash },
      { headers: { "Content-Type": "application/json; charset=UTF-8" } },
    )
    .then((response) => {
      ElMessage.success(t("login.successPrompt"));
      const userVo: UserVo = response.data;
      loginStore.userVo = userVo;
      loginStore.password = form.password;
      getAvatar();
      router.push("/dicts");
    })
    .catch((error) => {
      if (error.response) ElMessage.error(t("login.userErrPrompt"));
      else ElMessage.error(t("login.networkErrPrompt"));
    });
}

function getAvatar(): void {
  axios
    .get(`/api/users/${loginStore.userVo?.id}/profile/avatar`, {
      responseType: "blob",
    })
    .then((response) => {
      loginStore.avatar = window.URL.createObjectURL(response.data);
    })
    .catch((error) => {
      console.log(error);
      ElMessage.error(t("userInfo.avatar.errGetAvatar"));
    });
}
</script>

<style scoped>
#selectDictContainer {
  height: 100%;
  padding: 0;
}

.dictCard {
  margin: 4%;
  border-radius: 12px;
  transition: all 0.2s ease;
}

html.dark .dictCard {
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.72);
}

.dictCard:hover {
  scale: 1.02;
  filter: brightness(105%) grayscale(10%);
}

html.dark .dictCard:hover {
  filter: brightness(110%) saturate(120%);
}
.dictCard1 {
  background-image: -moz-linear-gradient(
    180deg,
    rgba(207, 252, 231, 0.97),
    rgba(206, 229, 253, 0.97)
  );
  background-image: -webkit-linear-gradient(
    180deg,
    rgba(207, 252, 231, 0.97),
    rgba(206, 229, 253, 0.97)
  );
  background-image: linear-gradient(
    180deg,
    rgba(207, 252, 231, 0.97),
    rgba(206, 229, 253, 0.97)
  );
}

.dictCard2 {
  background-image: -moz-linear-gradient(
    45deg,
    rgba(206, 227, 253, 0.97),
    rgba(206, 245, 253, 0.97)
  );
  background-image: -webkit-linear-gradient(
    45deg,
    rgba(206, 227, 253, 0.97),
    rgba(206, 245, 253, 0.97)
  );
  background-image: linear-gradient(
    45deg,
    rgba(206, 227, 253, 0.97),
    rgba(206, 245, 253, 0.97)
  );
}

html.dark .dictCard1 {
  background-image: -moz-linear-gradient(
    135deg,
    rgb(4, 0, 77),
    rgba(92, 44, 169, 0.9)
  );
  background-image: -webkit-linear-gradient(
    135deg,
    rgb(4, 0, 77),
    rgba(92, 44, 169, 0.9)
  );
  background-image: linear-gradient(
    135deg,
    rgb(4, 0, 77),
    rgba(92, 44, 169, 0.9)
  );
}

html.dark .dictCard2 {
  background-image: -moz-linear-gradient(
    135deg,
    rgba(92, 44, 169, 0.9),
    rgba(60, 44, 79, 0.9)
  );
  background-image: -webkit-linear-gradient(
    135deg,
    rgba(92, 44, 169, 0.9),
    rgba(60, 44, 79, 0.9)
  );
  background-image: linear-gradient(
    135deg,
    rgba(92, 44, 169, 0.9),
    rgba(60, 44, 79, 0.9)
  );
}

.menu-item {
  justify-content: center;
  background-color: rgba(0, 0, 0, 0);
  height: 80px;
}

.dictRow {
  min-height: 90%;
  overflow: hidden;
}

.dictName {
  font-size: 20px;
}

.dictLang {
  font-size: 18px;
}

.taskButton {
  min-width: 80px;
  font-size: 16px;
  background-color: rgba(255, 255, 255, 0.5);
  margin: 5px;
  backdrop-filter: blur(5px);
}

html.dark .taskButton {
  background-color: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(5px);
}

#footer {
  position: sticky;
  bottom: 20px;
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px) grayscale(50%);
  height: 50px;
  border-radius: 15px;
  margin: 3px;
  box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.2);
  transition: all 0.5s ease;
}

html.dark #footer {
  background-color: rgba(41, 50, 54, 0.1);
}

#footer:hover {
  scale: 1.01;
  transition: all 0.5s ease;
}

#pagination {
  line-height: 50px;
}

.dictsMain {
  padding: 10px 50px;
  /* height: 100%; */
}

.dictsTrans-enter-from,
.dictsTrans-leave-to {
  opacity: 0;
  scale: 0.5;
}

.dictsTrans-move,
.dictsTrans-leave-active,
.dictsTrans-enter-active {
  transition: all 0.2s ease;
  /* transition-delay: 0.2s; */
}
.dictsTrans-leave-active {
  position: absolute;
  opacity: 0;
  scale: 0.3;
  z-index: -1;
}

.d {
  right: 0;
  clip-path: polygon(0% 0%, 40% 100%, 100% 100%, 100% 0%);
  background-position: 800px 0;
}

.e {
  right: 0;
  clip-path: polygon(20% 0%, 0% 100%, 100% 100%, 100% 0%);
  background-position: 800px 0;
}

.a:hover .b {
  left: -200px;
}

.a:hover .c {
  left: -150px;
}

.a:hover .d {
  right: -140px;
}

.a:hover .e {
  right: -220px;
}

.a:hover div {
  opacity: 1;
}

.f {
  opacity: 0;
  font: 900 50px "";
  letter-spacing: 10px;
  color: #87e0cc;
  transition: 1.5s;
}

.a:hover .f {
  opacity: 1;
}
</style>
