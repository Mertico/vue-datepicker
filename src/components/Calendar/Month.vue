<template>
  <div class="month">
    <div class="month-title">
      {{ dateMonth.toLocaleString(this.lang, { month: "long" }) }}
      {{ dateMonth.getFullYear() }}
    </div>
    <table cellspacing="0" cellpadding="0">
      <thead>
        <th v-for="day in weekday" :key="day">
          {{ day }}
        </th>
      </thead>

      <tr v-for="(weeks, index) in days" :key="index">
        <Day
          v-for="date in weeks"
          v-if="date"
          :key="date"
          :date="date"
          :date-month="dateMonth"
          :start-disable="startDisable"
          :end-disable="endDisable"
          :class="
            fillEmployment[date] && `day-employment__${fillEmployment[date]}`
          "
        />
        <td v-else></td>
      </tr>
    </table>
  </div>
</template>

<script>
import Day from "./Day.vue";
import range from "lodash/range";
import chunk from "lodash/chunk";
import flatten from "lodash/flatten";


export default {
  name: "Month",
  components: {
    Day
  },
  props: {
    dateMonth: {
      type: Date,
      required: true
    },
    startDisable: {
      type: Date,
      required: true,
      default: () => new Date()
    },
    endDisable: {
      type: Date
    },
    lang: {
      default: "ru-RU",
      type: String,
      validator(value) {
        return ["ru-RU", "en-US"].includes(value);
      }
    },
    employment: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    days() {
      let days = [];
      if (this.dateMonth.getDay() > 0) {
        days = Array(this.dateMonth.getDay() - 1); //Воссоздаем пропущеные дни недели на нaчало месяца (-1 день недели для сдвига дней недель)
      } else {
        days = Array(6);
      }
      let lastDay = new Date(
        this.dateMonth.getFullYear(),
        this.dateMonth.getMonth() + 1,
        0
      );
      days = days.concat(range(1, lastDay.getDate() + 1)); // Заполняем днями месяца
      if (lastDay.getDay() != 0)
        days = days.concat(Array(7 - (days.length % 7))); //Воссоздаем пропущеные дни недели на конец месяца (+1 день недели для сдвига дней недель)

      return chunk(days, 7); // Разбиваем по неделям
    },
    weekday() {
      return this.days[1].map(date =>
        new Date(
          this.dateMonth.getFullYear(),
          this.dateMonth.getMonth(),
          date
        ).toLocaleString(this.lang, { weekday: "short" })
      );
    },
    fillEmployment() {
      const paris = this.employment.map(value => [
        value.from.getTime(),
        value.to.getTime()
      ]);
      if (!paris.length) return [];

      const startTime = this.dateMonth.getTime();

      const fill = flatten(this.days)
        .filter(v => v)
        .map(day => {
          if (!day) return;
          const leftPart = startTime + (day - 1) * 86400000;
          const rightPart = startTime + day * 86400000 - 1;
          const isLeftPartEmploy = paris.find(
            v => v[0] <= leftPart && leftPart < v[1]
          );
          const isRightPartEmploy = paris.find(
            v => v[0] <= rightPart && rightPart < v[1]
          );

          if (isLeftPartEmploy && isRightPartEmploy) {
            return "both";
          } else if (isLeftPartEmploy) {
            return "left";
          } else if (isRightPartEmploy) {
            return "right";
          }
        });
      fill.unshift(undefined); // Так как дни идут с 1, не с 0
      return fill;
    }
  },
  async mounted() {
    await this.$nextTick();
    if (
      this.$parent.orientation == "vertical" &&
      this.$parent.dateIn &&
      this.dateMonth.getFullYear() == this.$parent.dateIn.getFullYear() &&
      this.dateMonth.getMonth() == this.$parent.dateIn.getMonth()
    ) {
      setTimeout(() => {
        this.$el.scrollIntoView({ block: "center", behavior: "smooth" });
      }, 500);
    }
  }
};
</script>

<style lang="scss" scoped>
.month {
  display: inline-block;
  table {
    border-collapse: collapse;
    th {
      text-align: center;
      line-height: 18px;
      text-transform: lowercase;
      font-size: 14px;
      font-weight: 400;
      padding: 8px 0;
      &:nth-child(7n-1),
      &:nth-child(7n) {
        color: #f51449;
      }
    }
  }
  &-title {
    text-align: center;
    font-size: 17px;
    text-transform: capitalize;
  }
}
</style>
