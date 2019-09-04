<template>
  <transition name="base-modal--fade">
    <div
      class="base-modal"
      :class="{
        desktop: !this.$parent.isMobile,
        mobile: this.$parent.isMobile
      }"
      v-if="visible"
    >
      <template v-if="this.$parent.isMobile">
        <div class="base-modal-header">
          <div class="base-modal-close" @click="$parent.close()"></div>
          {{ title }}
        </div>
      </template>
      <template v-else>
        <div class="base-modal-header" v-if="this.$parent.showHeader">
          <div class="base-modal-header--tooltip">
            {{ Translation["tooltip"] }}
          </div>
          <div
            class="base-modal-header--close-after"
            @click="$parent.close('another')"
          >
            {{ Translation["closeText"] }}
          </div>
        </div>
        <div class="base-modal-prev" @click="prev()"></div>
        <div class="base-modal-next" @click="next()"></div>
      </template>
      <div class="base-modal-body">
        <slot></slot>
      </div>
    </div>
  </transition>
</template>
<script>
import Translation from "./../locales.json";

export default {
  name: "BaseModal",
  props: {
    title: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      visible: false,
      Translation: Translation[this.$parent.lang]
    };
  },
  methods: {
    show() {
      this.visible = true;
    },
    close() {
      this.visible = false;
    },
    toggle() {
      this.visible = !this.visible;
    },
    next() {
      this.$emit("next");
    },
    prev() {
      this.$emit("prev");
    }
  }
};
</script>
<style lang="scss" scoped>
.base-modal--fade-enter-active,
.base-modal--fade-leave-active {
  @media (min-width: 768px) {
    opacity: 1;
    transform: scale(1, 1);
    transform-origin: 5% 0%;
    transition: transform 0.35s ease, opacity 0.15s ease;
  }

  @media (max-width: 767px) {
    opacity: 1;
    transition: opacity 0.15s ease;
  }
}
.base-modal--fade-enter,
.base-modal--fade-leave-to {
  @media (min-width: 768px) {
    transform: scale(0, 0);
    opacity: 0;
  }

  @media (max-width: 767px) {
    opacity: 0;
  }
}
.base-modal {
  &.mobile {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999999;
  }
  background-color: white;
  &.desktop {
    position: absolute;
    z-index: 9999999;
    width: 596px;
    box-shadow: 0 15px 30px 10px rgba(68, 68, 68, 0.08);
    margin-top: 26px;
    padding-top: 20px;
  }
  &-header {
    height: 30px;
    text-align: center;
    font-size: 17px;
    line-height: 30px;
    background-color: white;
    color: black;
    .base-modal.mobile & {
      border-bottom: 1px solid #d1d1d1;
      height: 50px;
      line-height: 50px;
    }
    min-height: 43px;
    &--close-after {
      float: right;
      color: #2d6cb4;
      cursor: pointer;
      font-size: 14px;
      padding-right: 20px;
    }
    &--tooltip {
      float: left;
      color: #999;
      &::before {
        content: "";
        display: inline-block;
        float: left;
        width: 26px;
        height: 24px;
        background-image: url("../assets/lamp.svg");
        margin-right: 8px;
        margin-left: 20px;
      }
    }
  }
  &-body {
    .base-modal.desktop & {
      padding: 0 20px;
    }
    padding-bottom: 20px;
    .base-modal.mobile & {
      overflow: auto;
      max-height: calc(100% - 51px);
    }
  }
  &-prev,
  &-next {
    background-image: url("../assets/arrow.svg");
    background-repeat: no-repeat;
    cursor: pointer;
    display: inline-block;
    margin-top: 5px;
    height: 13px;
    width: 20px;
    fill: #e4e7e7;
    stroke-width: 1;
    float: left;
    position: relative;
    left: 20px;
  }
  &-next {
    transform: scale(-1, 1);
    left: initial;
    right: 20px;
    float: right;
  }
  &-close {
    position: absolute;
    right: 10px;
    font-size: 64px;
    line-height: 40px;
    width: 40px;
    height: 50px;
    transform: scale(0.7);
    &::before,
    &::after {
      content: "";
      background-color: black;
      width: 3px;
      height: 24px;
      display: inline-block;
    }
    &::before {
      transform: rotate(45deg) translate(1px, -1px);
      transform-origin: 100% 50%;
    }
    &::after {
      transform: rotate(-45deg);
      transform-origin: 0% 50%;
    }
  }
}
</style>
