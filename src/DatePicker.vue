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
      orientation="horizontal"
      v-model="date"
      :lang="Translation['lang']"
      :changeRange="changeRange"
      :type="type"
      :startDisable="startDisable"
      :employment="employment"
      ref="CalendarRef"
    />
    <div class="calendar-footer">
      <div
        class="calendar--reset"
        @click="reset"
        :class="{
          'calendar--reset-visible':
            date instanceof Object && date.out && date.in
        }"
      >
        {{ Translation["reset"] }}
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
      default: "range",
      type: String,
      validator(value) {
        return ["single", "range"].includes(value);
      }
    },
    size: {
      default: "big",
      type: String,
      validator(value) {
        return ["small", "big"].includes(value);
      }
    },
    lang: {
      default: "ru",
      type: String,
      validator(value) {
        return ["ru", "en"].includes(value);
      }
    },
    showHeader: {
      default: true,
      type: Boolean
    },
    startDisable: {
      type: Date,
      default: () => new Date()
    },
    changeRange: {
      default: null,
      validator(value) {
        return [null, "in", "out"].includes(value);
      }
    },
    i18n: {
      type: Object,
      default: () => ({})
    },
    employment: {
      type: Array,
      default: () => []
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
      if (this.$attrs.value instanceof Date) {
        this.date = this.$attrs.value;
      } else if (this.$attrs.value instanceof Object) {
        this.$set(this.date, "in", this.$attrs.value.in);
        this.$set(this.date, "out", this.$attrs.value.out);
      }
    }
  },
  methods: {
    toggle() {
      if (this.$refs.baseModalRef.visible)
        this.show();
      else 
        this.close();
      this.$refs.baseModalRef.toggle();
    },
    show() {
      if (this.$attrs.value instanceof Date) {
        this.beginDate = this.$attrs.value || new Date();
      } else if (this.$attrs.value instanceof Object) {
        this.beginDate = this.$attrs.value.in || this.$attrs.value.out || new Date();
      }
      this.$emit("show");
      this.$refs.baseModalRef.show();
    },
    close(value) {
      this.$emit("close", value);
      this.$refs.baseModalRef.close();
    },
    prev() {
      this.beginDate = new Date(
        new Date(this.beginDate).setMonth(this.beginDate.getMonth() - this.countMonth)
      );
    },
    next() {
      this.beginDate = new Date(
        new Date(this.beginDate).setMonth(this.beginDate.getMonth() + this.countMonth)
      );
    },
    reset() {

      if (this.date instanceof Date) {
        this.date = null
      } else if (this.$attrs.value instanceof Object) {
        this.$set(this.date, "in", null);
        this.$set(this.date, "out", null);
      }
      this.$refs.CalendarRef.reset();
      this.$emit("input", this.date);
      this.$emit("change", this.date);
    },
    handleWindowResize() {
      if (window.innerWidth <= 768) {
        this.isMobile = true;
        this.countMonth = 1;
      } else {
        this.isMobile = false;
        this.countMonth = this.size == "small" ? 1 : 2;
      }
      return this.isMobile;
    }
  },
  mounted() {
    if (this.$attrs.value instanceof Date) {
      this.$set(this.date, "single", this.$attrs.value);
    } else if (this.$attrs.value instanceof Object) {
      this.$set(this.date, "in", this.$attrs.value.in);
      this.$set(this.date, "out", this.$attrs.value.out);
    }
    window.addEventListener("resize", this.handleWindowResize);
    if (this.isMobile) this.countMonth = 1;
    else this.countMonth = this.size == "small" ? 1 : 2;
  },
  destroyed() {
    window.removeEventListener("resize", this.handleWindowResize);
  },
  data() {
    return {
      countMonth: this.size == "small" ? 1 : 2,
      beginDate: new Date(),
      date: {},
      Translation: { ...Translation[this.lang], ...this.i18n[this.lang] },
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
  opacity: 0;
  transition: opacity 0.2s;
  pointer-events: none;
  display: inline-block;
  &-visible {
    pointer-events: auto;
    opacity: 1;
  }
}
.base-modal .calendar-footer {
  display: flex;
  align-items: center;
  position: absolute;
  bottom: 28px;
  right: 20px;
}
.calendar-value {
  padding: 8px;
}
</style>
