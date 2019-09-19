<template>
  <div
    class="calendar"
    :class="{
      horizontal: orientation == 'horizontal',
      vertical: orientation == 'vertical'
    }"
  >
    <template v-for="date in dateMonth">
      <Month
        :dateMonth="date"
        :lang="lang"
        :startDisable="startDisable"
        :key="date.toLocaleString()"
        :employment="employment"
      />
    </template>
  </div>
</template>

<script>
import Month from "./Month.vue";

export default {
  name: "Calendar",
  components: {
    Month
  },
  props: {
    type: {
      default: "range",
      type: String,
      validator(value) {
        return ["single", "range"].includes(value);
      }
    },
    lang: {
      default: "ru-RU",
      type: String,
      validator(value) {
        return ["ru-RU", "en-US"].includes(value);
      }
    },
    beginDate: {
      type: Date,
      require: true
    },
    countMonth: {
      default: 2,
      type: Number
    },
    orientation: {
      default: "horizontal",
      type: String,
      validator(value) {
        return ["vertical", "horizontal"].includes(value);
      }
    },
    changeRange: {
      default: null,
      validator(value) {
        return [null, "in", "out"].includes(value);
      }
    },
    startDisable: {
      type: Date,
      default: () => new Date()
    },
    employment: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    dateMonth() {
      return [...Array(this.countMonth).keys()].map(
        month =>
          new Date(
            this.beginDate.getFullYear(),
            this.beginDate.getMonth() + month,
            1
          )
      );
    },
    startDateMonth() {
      return new Date(
        this.beginDate.getFullYear(),
        this.beginDate.getMonth(),
        1
      );
    },
    dateIn: {
      get() {
        return this.date.in;
      },
      set(value) {
        // Меняем местами даты если они выбраны в обратном порядке
        if (
          value &&
          this.date.out &&
          value.getTime() > this.date.out.getTime()
        ) {
          if (this.$parent.$parent.changeRange == "in") {
            this.date.out = null;
          } else {
            let tmp = this.date.out;
            this.date.out = value;
            value = tmp;
          }
        }
        this.$set(this.date, "in", value);
        this.$emit("input", this.date);
      }
    },
    dateOut: {
      get() {
        return this.date.out;
      },
      set(value) {
        // Меняем местами даты если они выбраны в обратном порядке
        if (value && this.date.in && value.getTime() < this.date.in.getTime()) {
          if (this.$parent.$parent.changeRange == "out") {
            this.date.in = null;
          } else {
            let tmp = this.date.in;
            this.date.in = value;
            value = tmp;
          }
        }
        this.$set(this.date, "out", value);
        this.$emit("input", this.date);
      }
    },
    dateSingle: {
      get() {
        return this.date.single;
      },
      set(value) {
        this.$set(this.date, "single", value);
        this.$emit("input", this.date.single);
      }
    }
  },
  methods: {
    reset() {
      this.$set(this.date, "in", null);
      this.$set(this.date, "out", null);
      this.$set(this.date, "single", null);
    }
  },
  watch: {
    "$attrs.value": {
      deep: true,
      immediate: true,
      handler() {
        if (this.$attrs.value instanceof Date) {
          this.date.single = this.$attrs.value;
        } else if (this.$attrs.value instanceof Object) {
          this.date.in = this.$attrs.value.in;
          this.date.out = this.$attrs.value.out;
        }
      }
    }
  },
  mounted() {
    // Подстановка даты
    if (this.$attrs.value instanceof Date) {
      this.date.single = this.$attrs.value;
    } else if (this.$attrs.value instanceof Object) {
      this.date.in = this.$attrs.value.in;
      this.date.out = this.$attrs.value.out;
    }
  },
  data() {
    return {
      date: {
        in: null,
        out: null,
        single: null
      },
      hoverDate: null
    };
  }
};
</script>

<style lang="scss" scoped>
.calendar {
  user-select: none;
  line-height: 1;
  &.vertical {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
    .month {
      padding: 10px 0;
    }
  }
  &.horizontal {
    display: flex;
    .month {
      min-height: 283px;
    }
    .month:not(:last-child) {
      margin-right: 20px
    }
    // ::v-deep .month {
    //   table {
    //     min-height: 266px;
    //   }
    //   table tr {
    //     // &:nth-child(6n) + tr {
    //     //   background: #000;
    //     //   margin-bottom: -40px;
    //     // }
    //   }
    // }
  }
  .month {
    // padding: 0 10px;
  }
}
</style>
