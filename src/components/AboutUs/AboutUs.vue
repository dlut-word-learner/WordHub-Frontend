<!--
SPDX-FileCopyrightText: 2024 WordHub Organization <integral@member.fsf.org>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <el-container id="body">
    <div class="a">
      <div class="b">
        <a href="#">{{ $t("aboutUs.description") }}</a>
        <h2>Donate us</h2>
        WordHub项目组出品
      </div>
      <div class="c">
        <!-- --i是用来计算平面圆柱的动效延迟和距离的
            --w则是用来计算平面圆柱的宽度 -->
        <div class="d" style="--i: 1; --w: 1.5"></div>
        <div class="d" style="--i: 2; --w: 1.6"></div>
        <div class="d" style="--i: 3; --w: 1.4"></div>
        <div class="d" style="--i: 4; --w: 1.7"></div>
        <div class="e" style="--i: 5"></div>
      </div>
      <!-- 设置二维码 -->
      <div class="f"><img :src="image" alt="Image" /></div>
    </div>
  </el-container>
</template>

<script setup lang="ts">
import image from "../AboutUs/donateus.jpg";
</script>

<style scoped>
#body {
  display: flex;
  justify-content: center;
}
.a {
  position: relative;
  width: 700px;
  height: 400px;
  background-color: #a0cfff;
  top: 120px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.2);
  transition: scale 0.5s ease;
}

html.dark .a {
  background-color: #337ecc;
}
.b {
  position: absolute;
  width: 200px;
  height: 300px;
  left: 0;
  margin: 75px 50px;
  transition: 1s;
  color: #fff;
}
html.dark .b {
  color: #e5eaf3;
}

.b a {
  text-decoration: none;
  color: #fff;
  font: 900 28px "";
}
.b h2 {
  /* 鼠标放开时的动画，第一个值是动画的过渡时间
            第二个值是延迟一秒后执行动画 */
  transition: 0.5s 1s;
  opacity: 0;
  color: rgb(30, 210, 200);
}
.b span {
  transition: 0.5s 1s;
  color: #fff;
  font: 500 15px "";
  position: absolute;
  top: 70px;
}
.c {
  position: absolute;
  top: -130px;
  right: -240px;
}
.d,
.e {
  position: absolute;
  right: calc(var(--i) * 100px);
  width: calc(var(--w) * 40px);
  height: 500px;
  overflow: hidden;
  border-radius: 100px;
  transform: rotateZ(220deg) translate(0, 0);
  background: rgb(240, 220, 150);
  transition: 0.5s 0.5s;
}
.d:nth-child(2) {
  background: rgb(240, 190, 230);
}
.e {
  left: -470px;
  top: -140px;
  width: 70px;
  background-color: rgb(90, 220, 150);
}
.a:hover .c div {
  /* 设置延迟动画 */
  transition: 0.5s calc(var(--i) * 0.1s);
  /* 移动的轨迹 */
  transform: rotateZ(220deg) translate(-200px, 400px);
}
.a:hover .b {
  transition: 1s 0.5s;
  left: 370px;
}
.a:hover .b span {
  transition: 1s 0.5s;
  top: 105px;
}
.a:hover .b h2 {
  transition: 1s 0.5s;
  opacity: 1;
}
.f {
  width: 250px;
  height: 250px;
  position: absolute;

  background-size: cover;
  margin: 70px;
  opacity: 0;
  transition: 0.5s;
}
.a:hover .f {
  transition: 1s 1.3s;
  opacity: 1;
}

.a:hover {
  scale: 1.02;
  transition: scale 0.5s ease;
}
</style>
