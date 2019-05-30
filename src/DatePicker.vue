<template>
  <BaseModal
    :title="Translation['choiceDate']"
    @next="next"
    @prev="prev"
    ref="baseModalRef"
  >
    <Calendar
      :beginDate="beginDate"
      :countMonth="countMonth"
      :orientation="typeCalendar"
      v-model="date"
      :lang="Translation['lang']"
      :changeRange="changeRange"
      :type="type"
      :startDisable="startDisable"

      ref="CalendarRef"
    />
    <div class="calendar-footer">
      <div class="calendar--reset" @click="reset" :class="{ 'calendar--reset-visible': date}">
        {{ Translation["reset"] }}
      </div>
      <div class="calendar--more" @click="more" v-if="isMobile">
        {{ Translation["more"] }}
      </div>
    </div>
  </BaseModal>
</template>

<script>
import Translation from "./locales.json";
import Calendar from "./components/Calendar";
import BaseModal from "./components/BaseModal";

export default {
  name: "DatePicker",
  components: {
    Calendar,
    BaseModal
  },
  props: {
    type: {
      default: 'range',
      type: String,
      validator(value) {
        return ['single', 'range'].includes(value);
      }
    },
    lang: {
      default: 'ru',
      type: String,
      validator(value) {
        return ['ru', 'en'].includes(value);
      }
    },
    showHeader: {
      default: true,
      type: Boolean
    },
    startDisable: {
      type: Date,
      required: true,
      default: () => new Date(),
    },
    changeRange: {
      default: null,
      validator(value) {
        return [null, "in", "out"].includes(value);
      }
    },
    i18n: {
      type: Object,
      default: ()=> ({}),
    }

  },
  watch: {
    date: {
      deep: true,
      handler() {
        if (this.date instanceof Object && this.date.out && this.date.in) {
          this.$emit("input", this.date);
          this.$emit("change", this.date);
        }
        if (this.date instanceof Date) {
          this.$emit("input", this.date);
          this.$emit("change", this.date);
        }
      }
    },
    "$attrs.value": function() {
      if(this.$attrs.value instanceof Date) {
        this.date = this.$attrs.value;
      } else if (this.$attrs.value  instanceof Object) {
        this.$set(this.date, 'in', this.$attrs.value.in)
        this.$set(this.date, 'out', this.$attrs.value.out)
      }
    }
  },
  methods: {
    toggle() {
      if(!this.$refs.baseModalRef.visible)
        this.$emit("show");
      else
        this.$emit("close");
      this.$refs.baseModalRef.toggle();
    },
    show() {
      this.$emit("show");
      this.$refs.baseModalRef.show();
    },
    close() {
      this.$emit("close");
      this.$refs.baseModalRef.close();
    },
    prev() {
      this.beginDate = new Date(
        new Date(this.beginDate).setMonth(this.beginDate.getMonth() - 2)
      );
    },
    next() {
      this.beginDate = new Date(
        new Date(this.beginDate).setMonth(this.beginDate.getMonth() + 2)
      );
    },
    more() {
      this.countMonth += 6;
    },
    reset() {
      this.$set(this.date, 'in', null)
      this.$set(this.date, 'out', null)
      this.$set(this.date, 'single', null)
      this.$refs.CalendarRef.reset()
      this.$emit("input", this.date);
      this.$emit("change", this.date);
    },
    handleWindowResize() {
      if (window.innerWidth <= 768) {
        this.isMobile = true;
        if(this.countMonth < 30)
          this.countMonth = 30;
      } else {
        this.isMobile = false;
        this.countMonth = 2;
      }
      return this.isMobile;
    }
  },
  computed: {
    typeCalendar() {
      return this.isMobile ? "vertical" : "horizontal";
    },
  },
  mounted() {
    if(this.$attrs.value instanceof Date) {
      this.$set(this.date, 'single', this.$attrs.value)
    } else if (this.$attrs.value  instanceof Object) {
      this.$set(this.date, 'in', this.$attrs.value.in)
      this.$set(this.date, 'out', this.$attrs.value.out)
    }
    window.addEventListener("resize", this.handleWindowResize);
    if(this.isMobile)
      this.countMonth = 30;
    else
      this.countMonth = 2;
  },
  destroyed() {
    window.removeEventListener("resize", this.handleWindowResize);
  },
  data() {
    return {
      countMonth: 2,
      beginDate: new Date(),
      date: {},
      Translation: {...Translation[this.lang], ...this.i18n[this.lang]},
      isMobile: this.handleWindowResize()
    };
  }
};
</script>

<style lang="scss" scoped>
.calendar--more {
  text-align: center;
  padding: 8px 15px;
  border: 1px solid #d1d1d1;
  display: inline-block;
  border-radius: 3px;
  float: right;
  margin-bottom: 10px;
  margin-top: -5px;
  color: #444;
  font-size: 14px;
  line-height: 16px;
  font-weight: 400;
}
.calendar--reset {
  cursor: pointer;
  color: #e10600;
  font-size: 14px;
  line-height: 16px;
  position: relative;
  // padding-top: 20px;
  // padding-bottom: 10px;
  opacity: 0;
  transition: opacity 0.2s;
  pointer-events: none;
  display: inline-block;
  .base-modal.mobile & {
    top: 0px;
  }
  &-visible {
    pointer-events: auto;
    opacity: 1;
  }
}
.base-modal.desktop .calendar-footer {
  height: 55px;
  display: flex;
  align-items: center;
}
.base-modal.mobile .calendar-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: red;
  height: 55px;
  padding: 15px 20px;
  box-shadow: 0 -2px 3px 0 rgba(0,0,0,.05);
  background-color: #fff;
  box-sizing: border-box;
}
.calendar-value {
  padding: 8px;
}
</style>
