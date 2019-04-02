<template>
  <div
    class="calendar"
    :class="{
      horizontal: orientation == 'horizontal',
      vertical: orientation == 'vertical'
    }"
  >
    <template v-for="date in dateMonth">
      <Month :dateMonth="date" :lang="lang" />
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
    lang: {
      default: 'ru-RU',
      type: String,
      validator(value) {
        return ['ru-RU', 'en-US'].includes(value);
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
          if(this.$parent.$parent.changeRange == "in") {
            this.date.out = null;
          } else {
            let tmp = this.date.out;
            this.date.out = value;
            value = tmp;
          }
        }
        this.$set(this.date, 'in', value)
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
          if(this.$parent.$parent.changeRange == "out") {
            this.date.in = null;
          } else {
            let tmp = this.date.in;
            this.date.in = value;
            value = tmp;
          }

        }
        this.$set(this.date, 'out', value)
        this.$emit("input", this.date);
      }
    }
  },
  methods: {
    reset() {
      this.$set(this.date, 'in', null)
      this.$set(this.date, 'out', null)
    }
  },
  watch: {
    "$attrs.value": {
      deep: true,
      immediate: true,
      handler() {
        if(this.$attrs.value) {
          this.date.in = this.$attrs.value.in
          this.date.out = this.$attrs.value.out
        }
      }
    },
  },
  mounted() {
    // Подстановка даты
    this.date.in = this.$attrs.value.in;
    this.date.out = this.$attrs.value.out;
  },
  data() {
    return {
      date: {
        in: null,
        out: null
      }
    };
  }
};
</script>

<style lang="scss">
.calendar {
  user-select: none;
  display: flex;
  justify-content: space-between;
  &.vertical {
    align-items: center;
    flex-direction: column;
    .month {
      padding: 10px 0;
    }
  }
  .month {
    // padding: 0 10px;
  }
}
</style>
